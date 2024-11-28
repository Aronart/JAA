"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ResultsContent() {
  const [status, setStatus] = useState("loading");
  const [result, setResult] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const recordId = searchParams?.get("id");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!recordId) {
          setStatus("error");
          return;
        }

        const response = await fetch(`/api/results?id=${recordId}`);
        const data = await response.json();

        if (data.success) {
          setResult(data.result);
          setStatus("success");
        } else {
          setStatus("error");
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
        <p className="text-gray-600">Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Results</h1>
      <p className="text-gray-700 max-w-2xl text-center">{result}</p>
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}