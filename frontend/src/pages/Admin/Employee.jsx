import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import employeesData from '../../assets/demoData/employee.json';

const Employee = () => {
  const [employees, setEmployees] = useState(employeesData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employee: "",
    email: "",
    phone: "",
    status: "Active",
    dueDate: null ,
    address: "",
  });
  const { toast } = useToast();

  const itemsPerPage = 10;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setNewEmployee((prev) => ({ ...prev, dueDate: date || null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedEmployee = {
      ...newEmployee,
      dueDate: newEmployee.dueDate ? format(newEmployee.dueDate, 'yyyy-MM-dd') : '',
    };
    setEmployees((prev) => [...prev, formattedEmployee]);
    setNewEmployee({
      employee: "",
      email: "",
      phone: "",
      status: "Active",
      dueDate: null,
      address: "",
    });
    setIsDialogOpen(false);
    toast({
      title: "Employee Added",
      description: "New employee has been successfully added.",
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Create Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="employee"
                  value={newEmployee.employee}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={newEmployee.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !newEmployee.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEmployee.dueDate ? format(newEmployee.dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEmployee.dueDate || undefined}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={newEmployee.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <Button type="submit" className="ml-auto">
                Create Employee
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto h-[calc(100vh-250px)] rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
                <TableRow>
                  <TableHead className="w-[250px]">Employee</TableHead>
                  <TableHead className="hidden sm:table-cell">Phone No.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Due Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEmployees.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{employee.employee}</div>
                      <div className="text-sm text-muted-foreground">{employee.email}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{employee.phone}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={employee.status.toLowerCase() === 'active' ? 'default' : 'destructive'}
                        className={employee.status.toLowerCase() === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{employee.dueDate}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="max-w-[200px] overflow-x-auto whitespace-nowrap">
                        {employee.address}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <Button onClick={handlePrevious} disabled={currentPage === 1} variant="outline">
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <Button onClick={handleNext} disabled={currentPage === totalPages} variant="outline">
          Next
        </Button>
      </div>
      <Toaster />
    </main>
  );
};

export default Employee;