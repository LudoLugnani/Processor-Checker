import { ComplianceReport, ComplianceStatus } from '../types';

export const generateHTMLReport = (report: ComplianceReport): string => {
  const date = new Date().toLocaleDateString('en-GB', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const getBadgeClass = (status: string) => {
    if (status.includes('Non-Compliant') || status.includes('Not Found')) return 'non-compliant';
    if (status.includes('Partially')) return 'partial';
    return 'compliant';
  };

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Data Processor Scan - Remediation Schedule</title>
      <style>
        body { 
          font-family: 'Times New Roman', Times, serif; 
          line-height: 1.6; 
          max-width: 900px; 
          margin: 40px auto; 
          color: #1a1a1a; 
          padding: 20px;
        }
        h1 { 
          color: #2c3e50; 
          border-bottom: 2px solid #2c3e50; 
          padding-bottom: 10px; 
          margin-bottom: 5px;
        }
        .meta {
          color: #666;
          font-style: italic;
          margin-bottom: 30px;
        }
        h2 { 
          color: #2c3e50; 
          margin-top: 40px; 
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        h3 {
          font-size: 1.1em;
          color: #444;
          margin-bottom: 10px;
        }
        .summary-box { 
          background: #f8f9fa; 
          padding: 25px; 
          border: 1px solid #ddd; 
          border-radius: 5px; 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .badge { 
          display: inline-block; 
          padding: 4px 8px; 
          border-radius: 4px; 
          font-weight: bold; 
          color: white; 
          font-size: 0.85em; 
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .compliant { background-color: #059669; }
        .partial { background-color: #d97706; }
        .non-compliant { background-color: #dc2626; }
        
        .req-item { 
          margin-bottom: 40px; 
          background: #fff;
        }
        .req-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: baseline; 
          margin-bottom: 15px; 
          background: #f1f5f9;
          padding: 10px 15px;
          border-radius: 4px;
        }
        .req-title { 
          font-weight: bold; 
          font-size: 1.1em; 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #334155;
        }
        .req-ref {
          font-size: 0.9em;
          color: #64748b;
          font-weight: normal;
          margin-left: 10px;
        }
        
        .section-label {
          font-size: 0.8em;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
          font-weight: bold;
          margin-bottom: 5px;
          font-family: sans-serif;
        }

        .analysis { 
          margin-bottom: 20px; 
          color: #333; 
          padding-left: 15px;
        }
        
        .clause-box { 
          background: #fff; 
          border-left: 4px solid #cbd5e1; 
          padding: 10px 20px; 
          margin: 10px 0 20px 0; 
          color: #475569;
          font-style: italic;
        }
        
        .suggestion-box { 
          background: #fffafa; 
          border: 1px solid #fecaca; 
          border-left: 4px solid #dc2626;
          padding: 20px; 
          margin-top: 15px; 
        }
        
        .redline { 
          color: #dc2626; 
          font-weight: bold; 
          font-family: 'Times New Roman', Times, serif;
          font-size: 1.05em;
        }

        .footer { 
          margin-top: 60px; 
          font-size: 0.8em; 
          text-align: center; 
          color: #94a3b8; 
          border-top: 1px solid #eee; 
          padding-top: 20px; 
          font-family: sans-serif; 
        }
        
        ul { margin-top: 5px; padding-left: 20px; }
        li { margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <h1>Data Processor Remediation Schedule</h1>
      <div class="meta">Generated on ${date} • Based on UK GDPR Art 28(3)</div>
      
      <div class="summary-box">
        <h2 style="margin-top:0; border:none; padding:0;">Executive Summary</h2>
        <p style="margin-bottom: 20px;">
          <strong>Overall Compliance Rating:</strong> <span class="badge ${getBadgeClass(report.overall_assessment.rating)}">${report.overall_assessment.rating}</span>
        </p>
        <p>${report.overall_assessment.summary}</p>
        
        <div style="display: flex; gap: 40px; margin-top: 30px;">
          <div style="flex: 1;">
            <h3>⚠️ Key Risks</h3>
            <ul>${report.overall_assessment.key_risks.map(r => `<li>${r}</li>`).join('')}</ul>
          </div>
          <div style="flex: 1;">
            <h3>✅ Key Strengths</h3>
            <ul>${report.overall_assessment.key_strengths.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
        </div>
      </div>

      <h2>Schedule of Required Amendments</h2>
      <p style="margin-bottom: 30px; color: #666;">
        The following table outlines compliance gaps identified in the contract. 
        Suggested drafting is provided in <strong style="color: #dc2626;">red</strong> for insertion into the agreement.
      </p>

      ${report.requirements.map(req => {
        const isCompliant = req.status === ComplianceStatus.COMPLIANT;
        const statusClass = getBadgeClass(req.status);
        
        if (isCompliant) return ''; // Optional: Skip compliant items in a remediation schedule to keep it short

        return `
          <div class="req-item">
            <div class="req-header">
              <div>
                <span class="req-title">${req.name}</span>
                <span class="req-ref">${req.article_reference}</span>
              </div>
              <span class="badge ${statusClass}">${req.status}</span>
            </div>
            
            <div class="section-label">Analysis</div>
            <div class="analysis">
              ${req.analysis}
            </div>

            ${req.excerpt ? `
              <div class="section-label">Existing Clause Reference: ${req.clause_reference || 'N/A'}</div>
              <div class="clause-box">
                "${req.excerpt}"
              </div>
            ` : ''}

            ${!isCompliant && req.suggested_improvement ? `
              <div class="suggestion-box">
                <div class="section-label" style="color: #991b1b;">Recommended Drafting Action</div>
                <p style="margin-top: 5px; margin-bottom: 10px; font-size: 0.9em; color: #7f1d1d;">
                  ${req.status.includes('Not Found') ? 'Insert the following new clause:' : 'Replace/Amend with the following:'}
                </p>
                <div class="redline">${req.suggested_improvement.replace(/\n/g, '<br/>')}</div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
      
      ${/* Also list compliant items briefly at the bottom */''}
      <h2>Compliant Items (No Action Required)</h2>
      <ul style="color: #555;">
      ${report.requirements.filter(r => r.status === ComplianceStatus.COMPLIANT).map(req => `
        <li><strong>${req.name}:</strong> Compliant (${req.clause_reference || 'Found'})</li>
      `).join('')}
      </ul>

      <div class="footer">
        Generated by <strong>Data Processor Scan</strong>. 
        This document is an automated analysis tool and does not constitute legal advice. 
        Please review all suggested drafting with qualified legal counsel.
      </div>
    </body>
    </html>
  `;
  return html;
};