"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadSectionRef = useRef<HTMLDivElement | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploadStatus("Uploading...");

    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUploadedFileName(file.name);
          setUploadStatus("Upload successful!");
        } else {
          setUploadStatus(result.message || "Upload failed. Please try again.");
        }
      } else {
        setUploadStatus("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("An error occurred. Please try again.");
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const scrollToUploadSection = () => {
    if (uploadSectionRef.current) {
      uploadSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-white shadow">
        <div className="text-xl font-bold">Temp</div>
        <div className="flex items-center space-x-6">
          <a href="#benefits" className="text-gray-600 hover:text-gray-800">
            Benefits
          </a>
          <a href="#features" className="text-gray-600 hover:text-gray-800">
            Features
          </a>
          <a href="#about-us" className="text-gray-600 hover:text-gray-800">
            About Us
          </a>
          <button className="px-4 py-2 bg-black text-white rounded">Sign In</button>
        </div>
      </nav>

      {/* Above-the-Fold Section */}
      <header className="flex items-center justify-between p-12 bg-gray-50 min-h-[80vh]">
        {/* Left Content */}
        <div className="max-w-lg space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Simplify your government forms.
          </h1>
          <p className="text-lg text-gray-600">
            Temp is an online assistant to simplify all your forms, generating action items that are easy to follow.
          </p>
          <button
            onClick={scrollToUploadSection}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
        {/* Right Content */}
        <div className="w-1/2">
          <img
            src="/placeholder.png"
            alt="Placeholder"
            className="w-full h-auto"
          />
        </div>
      </header>

      {/* Below-the-Fold Section */}
      <div
        ref={uploadSectionRef}
        className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Upload Your File</h2>

        {/* Drag-and-Drop Area */}
        <div
          onClick={openFileDialog}
          className="border-2 border-dashed rounded-lg w-full max-w-xl p-6 text-center bg-white transition-colors hover:bg-gray-100 cursor-pointer"
        >
          <p className="text-gray-600">Click to select a file</p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload Status */}
        {uploadStatus && (
          <p
            className={`mt-4 text-sm ${
              uploadStatus.includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {uploadStatus}
          </p>
        )}

        {/* Uploaded File Name */}
        {uploadedFileName && (
          <div className="mt-6 w-full max-w-xl bg-white rounded shadow-md p-4">
            <h2 className="text-lg font-medium mb-2 text-gray-800">
              Uploaded File:
            </h2>
            <p className="text-sm text-gray-700">{uploadedFileName}</p>
          </div>
        )}
      </div>
    </div>
  );
}