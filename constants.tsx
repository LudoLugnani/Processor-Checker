import { LucideIcon, Scale, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { ComplianceStatus } from './types';

export const STATUS_COLORS: Record<ComplianceStatus, string> = {
  [ComplianceStatus.COMPLIANT]: "bg-green-100 text-green-800 border-green-200",
  [ComplianceStatus.LIKELY_COMPLIANT]: "bg-green-100 text-green-800 border-green-200",
  [ComplianceStatus.PARTIALLY_COMPLIANT]: "bg-amber-100 text-amber-800 border-amber-200",
  [ComplianceStatus.NOT_FOUND]: "bg-red-100 text-red-800 border-red-200",
  [ComplianceStatus.LIKELY_NON_COMPLIANT]: "bg-red-100 text-red-800 border-red-200",
};

export const STATUS_ICONS: Record<ComplianceStatus, LucideIcon> = {
  [ComplianceStatus.COMPLIANT]: ShieldCheck,
  [ComplianceStatus.LIKELY_COMPLIANT]: ShieldCheck,
  [ComplianceStatus.PARTIALLY_COMPLIANT]: ShieldQuestion,
  [ComplianceStatus.NOT_FOUND]: ShieldAlert,
  [ComplianceStatus.LIKELY_NON_COMPLIANT]: ShieldAlert,
};
