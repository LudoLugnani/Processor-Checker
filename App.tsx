import React, { useState } from 'react';
import { Scale, Loader2, ArrowLeft, RefreshCcw } from 'lucide-react';
import { analyzeContract } from './services/geminiService';
import { generateHTMLReport } from './services/reportGenerator';
import { ComplianceReport, DocumentType } from './types';
import FileUpload from './components/FileUpload';
import AssessmentSummary from './components/AssessmentSummary';
import RequirementRow from './components/RequirementRow';

function App() {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState<DocumentType>(DocumentType.DPA);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (text: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeContract(text, docType);
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
  };

  const handleDownload = () => {
    if (!report) return;
    const htmlContent = generateHTMLReport(report);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Data-Processor-Remediation-Report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-legal-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-legal-500" />
            <span className="font-bold text-lg tracking-tight">Data Processor Scan</span>
          </div>
          {report && (
            <button 
              onClick={handleReset}
              className="text-sm text-legal-100 hover:text-white flex items-center gap-2 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {!report ? (
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Controller-Processor Contract Analysis</h1>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Upload a DPA, processing schedule, or contract clauses to verify compliance with Article 28(3) of the UK GDPR.
              </p>
            </div>

            <div className="max-w-xl mx-auto mb-8 flex justify-center">
              <select 
                value={docType} 
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="block w-full rounded-lg border-slate-300 bg-white py-3 px-4 text-slate-900 shadow-sm focus:border-legal-500 focus:ring-legal-500 sm:text-sm"
              >
                {Object.values(DocumentType).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-legal-600 animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-slate-800">Analysing Contract...</h3>
                <p className="text-slate-500">The "AI Lawyer" is reviewing your clauses against Art 28.</p>
              </div>
            ) : (
              <>
                <FileUpload onDataReady={handleAnalysis} isProcessing={loading} />
                {error && (
                  <div className="max-w-3xl mx-auto mt-6 p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg text-center">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <button 
               onClick={handleReset}
               className="mb-6 flex items-center text-slate-500 hover:text-legal-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Upload
            </button>

            <AssessmentSummary assessment={report.overall_assessment} onDownload={handleDownload} />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-5 md:col-span-4">Requirement</div>
                <div className="col-span-5 md:col-span-3">Status</div>
                <div className="hidden md:block col-span-4">Quick Analysis</div>
                <div className="col-span-2 md:col-span-1 text-right">Details</div>
              </div>
              <div>
                {report.requirements.map((req, index) => (
                  <RequirementRow key={index} req={req} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;