import React from 'react';
import { OverallAssessment, ComplianceStatus } from '../types';
import { STATUS_COLORS, STATUS_ICONS } from '../constants';
import { CheckCircle2, AlertTriangle, Download } from 'lucide-react';

interface AssessmentSummaryProps {
  assessment: OverallAssessment;
  onDownload: () => void;
}

const AssessmentSummary: React.FC<AssessmentSummaryProps> = ({ assessment, onDownload }) => {
  const StatusIcon = STATUS_ICONS[assessment.rating];
  const statusColor = STATUS_COLORS[assessment.rating];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${statusColor.split(' ')[0]}`}>
            <StatusIcon className={`w-8 h-8 ${statusColor.split(' ')[1]}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Overall Assessment</h2>
            <span className={`inline-block px-3 py-1 mt-1 rounded-full text-sm font-semibold border ${statusColor}`}>
              {assessment.rating}
            </span>
          </div>
        </div>
        <button 
          onClick={onDownload}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <p className="text-slate-600 mb-6 text-lg leading-relaxed">{assessment.summary}</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Key Strengths
          </h3>
          <ul className="space-y-2">
            {assessment.key_strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                <span className="w-1.5 h-1.5 mt-2 rounded-full bg-green-500 shrink-0" />
                {str}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Key Risks & Gaps
          </h3>
          <ul className="space-y-2">
            {assessment.key_risks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                <span className="w-1.5 h-1.5 mt-2 rounded-full bg-amber-500 shrink-0" />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSummary;