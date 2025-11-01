"use client"

import { useState, useEffect } from "react"
import { testDataFetching } from "@/app/actions/dashboard-metrics"

export default function TestDataPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    try {
      const results = await testDataFetching()
      setTestResults(results)
    } catch (error) {
      console.error("Test failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data Fetching Test</h1>
      
      <button 
        onClick={runTest}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Data Fetching"}
      </button>

      {testResults && (
        <div className="mt-8 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Call Analytics</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResults.callData, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Email Analytics</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResults.emailData, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Leads</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResults.leadsData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
