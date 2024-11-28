"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Results() {
  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
  const [result, setResult] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const recordId = searchParams.get("id"); // Get recordId from query params

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!recordId) {
          setStatus("error");
          return;
        }

        const response = await fetch(`/api/result?id=${recordId}`);
        const data = await response.json();

        if (data.success) {
          setResult(data.result); // Set the ChatGPT result
          setStatus("success");
        } else {
          setStatus("error"); // Handle error states
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        setStatus("error");
      }
    };

    fetchResults();
  }, [recordId]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Getting your results...</h1>
        <p className="text-gray-600">This may take a moment, please be patient.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
        <p className="text-gray-600">Please try again later or contact support.</p>
      </div>
    );
  }

  // Render results when available
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Results</h1>
      <p className="text-gray-700 max-w-2xl text-center">{result}</p>
    </div>
  );
}