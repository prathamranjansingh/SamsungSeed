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

    <main className="relative flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Analytics</h1>
      </div>

      <div className="relative flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        {/* Button placed in the top-right corner */}
        <Button
          onClick={handleUploadClick}
          className="absolute top-0 right-0 m-4"
        >
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
                <div className="flex flex-col items-center justify-center w-full">
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    onClick={(e) => { e.target.value = null }} // Clear previous file selection
                  />
                  {/* Show selected file name */}
                  {fileName ? (
                    <div className="flex items-center justify-between w-full p-4 border border-gray-300 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{fileName}</p>
                      <Button onClick={() => document.getElementById('dropzone-file').click()} >Change File</Button>
                    </div>
                  ) : (
                    <Button onClick={() => document.getElementById('dropzone-file').click()} className="w-full h-64 border-2 border-gray-300 border-dashed rounded-lg flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-100">
                      <FileSpreadsheet className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    </Button>
                  )}
                </div>
              </CardContent>
              <div className="flex justify-end p-4">
                <Button onClick={closeModal} className="mr-2">Close</Button>
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
