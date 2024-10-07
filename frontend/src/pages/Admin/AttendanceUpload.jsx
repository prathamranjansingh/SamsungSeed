"use client"

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

const employeesData = [
  {
    id: "01",
    name: "Chandra",
    day1: "Absent", day2: "Absent", day3: "Present", day4: "Absent", day5: "Absent",
    day6: "Present", day7: "Present", day8: "Present", day9: "Present", day10: "Absent",
    day11: "Absent", day12: "Absent", day13: "Present", day14: "Present", day15: "Present",
    day16: "Present", day17: "Present", day18: "Absent", day19: "Absent", day20: "Present",
    day21: "Present", day22: "Present", day23: "Present", day24: "Absent", day25: "Absent",
    day26: "Absent", day27: "Present", day28: "Present", day29: "Present", day30: "Present",
    day31: "Absent",
    total_present: 18,
    total_absent: 13,
  },
];

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
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Set token here, e.g., from local storage or context
    setToken(localStorage.getItem('token')); // Replace with actual token
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
          <Button onClick={handleUploadClick}>
            Upload Attendance
          </Button>
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
                <TableHead>Total Present</TableHead>
                <TableHead>Total Absent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeesData.map((employee) => (
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
                  <div className="flex items-center justify-between w-full p-4 border border-gray-300 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{fileName}</p>
                    <Button onClick={() => document.getElementById('dropzone-file').click()} variant="outline">Change File</Button>
                  </div>
                ) : (
                  <Button onClick={() => document.getElementById('dropzone-file').click()} variant="outline" className="w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
                    <FileSpreadsheet className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  </Button>
                )}
              </div>
            </CardContent>
            <div className="flex justify-end p-4">
              <Button variant="ghost" onClick={closeModal}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!file} className="ml-2">Upload</Button>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
