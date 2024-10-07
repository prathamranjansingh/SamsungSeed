import dotenv from "dotenv";
import xlsx from "xlsx";
import moment from "moment";
import multer from "multer";

import pkg from 'pg';
const { Pool } = pkg;


dotenv.config();
const saltRounds = parseInt(process.env.SALT, 10) || 10;
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,           // Corrected here
    password: PGPASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false,  // Only use this if you know what you are doing
    },
  });

  const upload = multer({ dest: 'uploads/' });

// Function to sanitize sheet names for use as table names
function sanitizeTableName(name) {
  const sanitized = name
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-z0-9_]/g, '') // Remove special characters except underscores
    .replace(/^_+|_+$/g, '') // Remove leading and trailing underscores
    .substring(0, 63); // Limit length to 63 characters
  return sanitized;
}

// Process time from the cell (handling up to 3 times)
function processTime(cell) {
  if (!cell || cell.trim() === '') return { login: null, logout: null };

  const times = cell.split(/\s+/).map(time => time.trim());
  console.log(`Raw times: ${times}`); // Debug log

  const validTimes = times.filter(time => {
    const [h, m] = time.split(':').map(Number);
    return !isNaN(h) && !isNaN(m) && h >= 0 && h < 24 && m >= 0 && m < 60;
  });

  if (validTimes.length === 2) {
    return { login: validTimes[0], logout: validTimes[1] };
  } else if (validTimes.length === 3) {
    return { login: validTimes[1], logout: validTimes[2] };
  } else if (validTimes.length === 1) {
    return { login: validTimes[0], logout: null }; // Only one valid time
  }
  return { login: null, logout: null }; // Return nulls if no valid times
}

// Function to determine attendance status
function isPresent(login, logout) {
  const loginTime = new Date(`1970-01-01T${login}:00`);
  const logoutTime = logout ? new Date(`1970-01-01T${logout}:00`) : null;

  const loginCutoff = new Date('1970-01-01T09:30:00'); // 9:30 AM
  const logoutCutoff = new Date('1970-01-01T17:30:00'); // 5:30 PM

  if (!logoutTime) {
    return 'Absent';
  }

  return (loginTime <= loginCutoff && logoutTime >= logoutCutoff) ? 'Present' : 'Absent';
}

// Create table dynamically based on the Excel sheet name and current year
async function createAttendanceTable(tableName, callback) {
  console.log('Creating table with name:', tableName); // Log the table name
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "${tableName}" (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      day1 VARCHAR(7) DEFAULT 'Absent',
      day2 VARCHAR(7) DEFAULT 'Absent',
      day3 VARCHAR(7) DEFAULT 'Absent',
      day4 VARCHAR(7) DEFAULT 'Absent',
      day5 VARCHAR(7) DEFAULT 'Absent',
      day6 VARCHAR(7) DEFAULT 'Absent',
      day7 VARCHAR(7) DEFAULT 'Absent',
      day8 VARCHAR(7) DEFAULT 'Absent',
      day9 VARCHAR(7) DEFAULT 'Absent',
      day10 VARCHAR(7) DEFAULT 'Absent',
      day11 VARCHAR(7) DEFAULT 'Absent',
      day12 VARCHAR(7) DEFAULT 'Absent',
      day13 VARCHAR(7) DEFAULT 'Absent',
      day14 VARCHAR(7) DEFAULT 'Absent',
      day15 VARCHAR(7) DEFAULT 'Absent',
      day16 VARCHAR(7) DEFAULT 'Absent',
      day17 VARCHAR(7) DEFAULT 'Absent',
      day18 VARCHAR(7) DEFAULT 'Absent',
      day19 VARCHAR(7) DEFAULT 'Absent',
      day20 VARCHAR(7) DEFAULT 'Absent',
      day21 VARCHAR(7) DEFAULT 'Absent',
      day22 VARCHAR(7) DEFAULT 'Absent',
      day23 VARCHAR(7) DEFAULT 'Absent',
      day24 VARCHAR(7) DEFAULT 'Absent',
      day25 VARCHAR(7) DEFAULT 'Absent',
      day26 VARCHAR(7) DEFAULT 'Absent',
      day27 VARCHAR(7) DEFAULT 'Absent',
      day28 VARCHAR(7) DEFAULT 'Absent',
      day29 VARCHAR(7) DEFAULT 'Absent',
      day30 VARCHAR(7) DEFAULT 'Absent',
      day31 VARCHAR(7) DEFAULT 'Absent',
      total_present INTEGER DEFAULT 0,
      total_absent INTEGER DEFAULT 0
    );
  `;

  pool.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err);
      return callback(err);
    }
    console.log('Table created or already exists:', tableName);

    // Ensure that the new columns exist (for existing tables)
    const addColumnsQuery = `
  ALTER TABLE "${tableName}"
  ADD COLUMN IF NOT EXISTS total_present INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_absent INTEGER DEFAULT 0;
  `;

    pool.query(addColumnsQuery, (err2, result2) => {
      if (err2) {
        console.error('Error adding new columns:', err2);
        return callback(err2);
      }
      console.log('New columns ensured in table:', tableName);
      callback(null);
    });
  });
}

// Process attendance data from the Excel sheet
function processAttendanceData(rows, tableName, callback) {
  const insertPromises = [];

  for (let rowIndex = 4; rowIndex < rows.length; rowIndex++) { // rowIndex 4 corresponds to 5th row
    const row = rows[rowIndex];

    if (!row || !Array.isArray(row) || row.length < 2) { // Ensure at least id and name exist
      console.warn(`Row at index ${rowIndex} is undefined or does not have enough data.`);
      continue; // Skip this row
    }

    const id = row[0] ? row[0].toString() : null;  // Treat ID as a string
    const name = row[1] || null; // Handle name gracefully

    if (id) {  // Ensure ID is not empty
      let total_present = 0;
      let total_absent = 0;
      const attendance = [];

      for (let i = 2; i <= 32; i++) { // Columns 3 to 32 correspond to days 1 to 31
        const cell = row[i];
        const { login, logout } = processTime(cell);
        const dayStatus = (login && logout) ? isPresent(login, logout) : 'Absent';
        attendance.push(dayStatus);

        if (dayStatus === 'Present') {
          total_present += 1;
        } else {
          total_absent += 1;
        }
      }

      if (attendance.length === 31) {
        const query = `INSERT INTO "${tableName}" (id, name, ${attendance.map((_, i) => `day${i + 1}`).join(', ')}, total_present, total_absent)
                       VALUES ($1, $2, ${attendance.map((_, i) => `$${i + 3}`).join(', ')}, $34, $35)
                       ON CONFLICT (id) DO UPDATE
                       SET name = EXCLUDED.name,
                           ${attendance.map((_, i) => `day${i + 1} = EXCLUDED.day${i + 1}`).join(', ')},
                           total_present = EXCLUDED.total_present,
                           total_absent = EXCLUDED.total_absent;`;

        const params = [id, name, ...attendance, total_present, total_absent];
        insertPromises.push(pool.query(query, params));
      } else {
        console.warn(`Skipping entry for ID ${id} due to invalid attendance data.`);
      }
    } else {
      console.warn(`Skipping entry at index ${rowIndex} due to missing ID.`);
    }
  }

  Promise.all(insertPromises)
    .then(() => {
      console.log('All attendance data processed successfully.');
      callback(null);
    })
    .catch(err => {
      console.error('Error inserting attendance data:', err);
      callback(err);
    });
}

// Attendance Upload Handler
async function handleAttendanceUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path;
    let workbook;

    try {
      workbook = xlsx.readFile(filePath);
    } catch (error) {
      console.error('Error reading Excel file:', error);
      return res.status(500).send('Error reading Excel file.');
    }

    // Use the entire original filename instead of just the sheet name
    const originalFilename = req.file.originalname.split('.').slice(0, -1).join('.'); // Remove file extension
    const sanitizedFilename = sanitizeTableName(originalFilename);
    const now = moment();
    const year = now.format('YYYY'); // Current year
    const tableName = `${sanitizedFilename}_${year}`; // Table name in the format: "filename_2024"

    const sheetName = workbook.SheetNames[0]; // You can still access the sheet if needed
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length < 5) { // Ensure there are enough rows
      return res.status(400).send('Excel file does not contain enough data.');
    }

    createAttendanceTable(tableName, (err) => {
      if (err) {
        return res.status(500).send('Error creating table.');
      }

      processAttendanceData(rows, tableName, (err) => {
        if (err) {
          return res.status(500).send('Error processing attendance data.');
        }
        res.send(`Data processed successfully and inserted into table "${tableName}"!`);
      });
    });
  } catch (err) {
    console.error("Error handling attendance upload:", err);
    res.status(500).send("Internal server error");
  }
}


function constructTableName(month, year) {
    const monthNumber = String(month).padStart(2, '0'); // Ensure two-digit format
    return `${monthNumber}summary_${year}`; // Format: MMsummary_YYYY
  }
  
  // Function to get attendance details from the specified table
  async function getAttendanceDetails(month, year) {
    const tableName = constructTableName(month, year);
    
    const query = `SELECT * FROM "${tableName}";`;
    try {
      const { rows } = await pool.query(query);
      return rows; // Return the retrieved rows
    } catch (err) {
      console.error('Error retrieving attendance details:', err);
      throw new Error('Error retrieving attendance details');
    }
  }
  
  // Function to handle the GET request for attendance details
  async function handleGetAttendance(req, res) {
    const { month, year } = req.query;
  
    // Validate the month and year
    if (!month || !year || isNaN(month) || isNaN(year)) {
      return res.status(400).send('Invalid month or year.');
    }
  
    try {
      const attendanceDetails = await getAttendanceDetails(month, year);
      res.json(attendanceDetails);
    } catch (err) {
      res.status(500).send('Error fetching attendance details.');
    }
  }

export {handleAttendanceUpload,handleGetAttendance}