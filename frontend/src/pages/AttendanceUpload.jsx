import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet } from 'lucide-react';

export default function AttendanceUpload() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(''); // State to hold the name of the selected file

  const handleUploadClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null); // Reset the file on modal close
    setFileName(''); // Reset the file name on modal close
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]; // Get the selected file
    if (selectedFile) {
      setFile(selectedFile); // Set the file state
      setFileName(selectedFile.name); // Update the file name state
    }
  };

  const handleSubmit = () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    // Here you can add your upload logic (e.g., sending the file to the server)
    console.log("Uploading file:", file);
    
    // Close the modal after submission
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Button onClick={handleUploadClick} className="mb-4">
            Upload Attendance
          </Button>

          {/* Modal for uploading the file */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal} />
              <Card className="relative z-10 w-full max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="mr-2" />
                    Upload Excel File
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileSpreadsheet className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">XLSX or XLS (MAX. 10MB)</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
                    </label>
                  </div>
                  {/* Display selected file name */}
                  {fileName && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Selected file: <span className="font-semibold">{fileName}</span></p>
                  )}
                </CardContent>
                <div className="flex justify-end p-4">
                  <Button onClick={closeModal} className="mr-2">Close</Button>
                  <Button onClick={handleSubmit} className="bg-blue-500 text-white">Submit</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
