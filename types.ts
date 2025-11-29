export enum ComplianceStatus {
  COMPLIANT = "Compliant",
  PARTIALLY_COMPLIANT = "Partially Compliant",
  NOT_FOUND = "Not Found / Non-Compliant",
  LIKELY_NON_COMPLIANT = "Likely Non-Compliant", // Used for overall rating
  LIKELY_COMPLIANT = "Likely Compliant" // Used for overall rating
}

export enum RiskLevel {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High"
}

export interface RequirementAnalysis {
  name: string;
  article_reference: string;
  status: ComplianceStatus;
  clause_reference: string;
  excerpt: string;
  analysis: string;
  suggested_improvement: string;
  risk_level: RiskLevel;
}

export interface OverallAssessment {
  rating: ComplianceStatus;
  summary: string;
  key_risks: string[];
  key_strengths: string[];
}

export interface ComplianceReport {
  overall_assessment: OverallAssessment;
  requirements: RequirementAnalysis[];
}

export enum DocumentType {
  DPA = "Standalone DPA",
  SCHEDULE = "Processing Schedule",
  CLAUSES = "General Agreement Clauses"
}