import React, { useState } from 'react';
import { RequirementAnalysis, ComplianceStatus, RiskLevel } from '../types';
import { STATUS_COLORS, STATUS_ICONS } from '../constants';
import { ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';

interface RequirementRowProps {
  req: RequirementAnalysis;
}

const RequirementRow: React.FC<RequirementRowProps> = ({ req }) => {
  const [isOpen, setIsOpen] = useState(false);
  const StatusIcon = STATUS_ICONS[req.status];
  const statusColor = STATUS_COLORS[req.status];

  const riskColor = 
    req.risk_level === RiskLevel.HIGH ? "text-red-600 bg-red-50" :
    req.risk_level === RiskLevel.MEDIUM ? "text-amber-600 bg-amber-50" :
    "text-green-600 bg-green-50";

  return (
    <div className="border-b border-slate-100 last:border-0">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`grid grid-cols-12 gap-4 p-4 items-center cursor-pointer hover:bg-slate-50 transition-colors ${isOpen ? 'bg-slate-50' : ''}`}
      >
        <div className="col-span-5 md:col-span-4 font-medium text-slate-800">
          {req.name}
          <div className="text-xs text-slate-400 font-normal mt-0.5">{req.article_reference}</div>
        </div>
        
        <div className="col-span-5 md:col-span-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
            <StatusIcon className="w-3 h-3" />
            {req.status}
          </span>
        </div>

        <div className="hidden md:block col-span-4 text-sm text-slate-600 truncate">
          {req.analysis}
        </div>

        <div className="col-span-2 md:col-span-1 flex justify-end">
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-6 bg-slate-50 border-t border-slate-100 grid md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Analysis</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{req.analysis}</p>
            </div>
            
            {req.excerpt && (
              <div className="bg-white p-3 rounded border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Identified Clause</h4>
                <p className="font-mono text-xs text-slate-600 italic">"{req.excerpt}"</p>
                <div className="mt-1 text-right text-xs text-slate-400">Ref: {req.clause_reference || "N/A"}</div>
              </div>
            )}
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded ${riskColor}`}>
                  Risk Level: {req.risk_level}
                </span>
             </div>

             {req.status !== ComplianceStatus.COMPLIANT && (
               <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                 <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                   <Sparkles className="w-3 h-3" /> Suggested Improvement
                 </h4>
                 <p className="text-sm text-amber-900 leading-relaxed font-medium">
                   {req.suggested_improvement || "No specific suggestion provided."}
                 </p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementRow;