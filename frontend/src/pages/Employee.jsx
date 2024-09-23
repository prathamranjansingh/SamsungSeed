import { useState } from "react";
import { Button } from '../components/ui/button';
import { CardContent, Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '../components/ui/badge';
import employeesData from '../assets/demoData/employee.json'; // Assuming the JSON is in /src/assets/demoData

const Employee = () => {
  const employees = employeesData; // Load employee data from the JSON file

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Calculate pagination values
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = employees.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Employee</h1>
      </div>
      <div>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="hidden sm:table-cell">Phone No.</TableHead>
                  <TableHead className="">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Due Date</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEmployees.map((employee, index) => (
                  <TableRow className="hover:bg-gray-100" key={index}>
                    <TableCell>
                      <div className="font-medium">{employee.employee}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {employee.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {employee.phone}
                    </TableCell>
                    <TableCell className="">
                      <Badge className={`text-xs text-white ${employee.status.toLowerCase() === 'active' ? 'bg-green-400' : 'bg-red-400'}`} variant={employee.statusVariant}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {employee.dueDate}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">
                      {employee.address}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button className="w-24"onClick={handlePrevious} size="sm" disabled={currentPage === 1}>
            Previous
          </Button>
          <div className="text-sm">
            Showing <span className="font-semibold">{currentPage}-{totalPages} </span>of <span className="font-semibold">{totalPages*itemsPerPage} </span>employees 
          </div>
          <Button className="w-24" onClick={handleNext} size="sm"  disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Employee;
