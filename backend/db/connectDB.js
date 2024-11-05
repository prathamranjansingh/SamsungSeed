import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

// Create a new postgres client
export const db = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,  // default port for PostgreSQL
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});


// export const db = postgres( {
//   host                 : 'localhost',            
//   port                 : 5432,          
//   database             : 'SEED',           
//   username             : 'postgres',            
//   password             : 'rahul',            
// })

export async function connectToDatabase() {
  try {
    await db`SELECT 1`; // Simple query to test the connection
    console.log('Database Connected successfully');
  } catch (err) {
    console.error('Connection error', err.stack);
  }
}
