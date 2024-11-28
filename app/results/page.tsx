"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Results() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Store error messages for debugging
  const searchParams = useSearchParams();
  const recordId = searchParams?.get("id");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!recordId) {
          console.error("No recordId provided");
          setError("No recordId provided in the URL.");
          setStatus("error");
          return;
        }

        console.log(`Fetching results for recordId: ${recordId}`);
        const response = await fetch(`/api/result?id=${recordId}`);

        if (!response.ok) {
          console.error(`API returned status ${response.status}`);
          setError(`API returned status ${response.status}`);
          setStatus("error");
          return;
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.success) {
          setResult(data.result);
          setStatus("success");
        } else {
          console.error("API responded with success: false");
          setError(data.error || "API responded with success: false");
          setStatus("error");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        setError("An unexpected error occurred while fetching results.");
        setStatus("error");
      }
    };

    fetchResults();
  }, [recordId]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Getting your results...
        </h1>
        <p className="text-gray-600">
          This may take a moment, please be patient.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-4">
          {error || "Please try again later or contact support."}
        </p>
        <p className="text-sm text-gray-500">
          If the issue persists, please check your API or logs for more details.
        </p>
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