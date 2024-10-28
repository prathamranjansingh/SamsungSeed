"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileSpreadsheet } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function AttendanceUpload() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [employeesData, setEmployeesData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [token, setToken] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const handleUploadClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setFileName('');
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('month', selectedMonth);
    formData.append('year', selectedYear);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log("File uploaded successfully");
      closeModal();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const fetchAttendanceDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/attendance`, {
        params: { month: months.indexOf(selectedMonth) + 1, year: selectedYear },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setEmployeesData(response.data);
    } catch (error) {
      console.error("Error fetching attendance details:", error);
    }
  };

  const sortedEmployeesData = [...employeesData].sort((a, b) => {
    if (sortConfig.key === 'present') {
      return sortConfig.direction === 'ascending' 
        ? a.total_present - b.total_present 
        : b.total_present - a.total_present;
    }
    if (sortConfig.key === 'absent') {
      return sortConfig.direction === 'ascending' 
        ? a.total_absent - b.total_absent 
        : b.total_absent - a.total_absent;
    }
    return 0; // No sorting if key is null
  });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <main className="relative flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={fetchAttendanceDetails}>Search</Button>
          <Button onClick={handleUploadClick}>Upload Attendance</Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Employee Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>
                  <button onClick={() => handleSort('present')}>
                    Total Present {sortConfig.key === 'present' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </button>
                </TableHead>
                <TableHead>
                  <button onClick={() => handleSort('absent')}>
                    Total Absent {sortConfig.key === 'absent' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEmployeesData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" onClick={() => handleEmployeeClick(employee)}>
                          {employee.name}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{employee.name}&apos;s Detailed Attendance</DialogTitle>
                        </DialogHeader>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(employee).filter(key => key.startsWith('day')).map((day) => (
                                <TableHead key={day} className="text-center">{day.replace('day', '')}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              {Object.keys(employee).filter(key => key.startsWith('day')).map((day) => (
                                <TableCell key={day} className="text-center">
                                  {employee[day] === 'Present' ? 'P' : 'A'}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>{employee.total_present}</TableCell>
                  <TableCell>{employee.total_absent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal} />
          <Card className="relative z-10 w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2" />
                Upload Excel File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center w-full">
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  onClick={(e) => { e.target.value = null }}
                />
                {fileName ? (
                  <div className="flex items-center justify-center w-full p-4 border border-dashed border-gray-300">
                    <FileSpreadsheet className="mr-2" />
                    {fileName}
                  </div>
                ) : (
                  <label
                    htmlFor="dropzone-file"
                    className="flex items-center justify-center w-full p-4 border border-dashed border-gray-300 cursor-pointer"
                  >
                    <FileSpreadsheet className="mr-2" />
                    <span className="text-gray-600">Drag and drop your file here or click to upload</span>
                  </label>
                )}
                <Button onClick={handleSubmit} className="mt-4 w-full">Upload</Button>
                <Button onClick={closeModal} variant="secondary" className="mt-2 w-full">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
