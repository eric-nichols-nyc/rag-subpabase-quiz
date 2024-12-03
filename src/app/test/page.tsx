'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

type TestResults = {
  insert: { document: string; quiz: string };
  select: { document: string; quiz: string };
  errors: { test: string; error: string }[];
};

export default function TestRLS() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);

  const runTests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-rls');
      const data = await response.json();
      setResults(data.testResults);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Test RLS Policies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run RLS Tests'
          )}
        </Button>

        {results && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Insert Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Documents:</span>
                      {results.insert.document === 'Success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Quizzes:</span>
                      {results.insert.quiz === 'Success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Documents:</span>
                      {results.select.document === 'Success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Quizzes:</span>
                      {results.select.quiz === 'Success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {results.errors.length > 0 && (
              <Card className="bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700">Errors</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-red-600">
                    {results.errors.map((error, index) => (
                      <li key={index}>
                        <strong>{error.test}:</strong> {error.error}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}