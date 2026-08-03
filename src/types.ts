export interface EvidenceFile {
  id: string;
  filename: string;
  uploadedAt: string;
  size: string;
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  author: string;
  action: string;
  details: string;
}

export interface CorporateAsset {
  id: string;
  name: string;
  category: 'CLOUD_INFRA' | 'DATABASE' | 'SAAS_APP' | 'NETWORK' | 'ENDPOINT';
  environment: 'PROD' | 'STAGING' | 'DEV';
  criticalityScore: number;
  owner: string;
  ipOrDomain: string;
}

export interface VendorProfile {
  id: string;
  name: string;
  serviceProvided: string;
  tier: 'TIER_1_CRITICAL' | 'TIER_2_HIGH' | 'TIER_3_MEDIUM';
  soc2Status: 'VERIFIED' | 'EXPIRED' | 'NOT_PROVIDED';
  inherentRiskScore: number;
  contactEmail: string;
}

export interface BusinessProcess {
  id: string;
  name: string;
  department: string;
  rtoHours: number;
  rpoHours: number;
  financialLossPerHour: number;
  criticalityTier: 'TIER_1_MISSION_CRITICAL' | 'TIER_2_ESSENTIAL' | 'TIER_3_NON_ESSENTIAL';
  linkedAssetIds: string[];
}

export interface SubControl {
  id: string;
  name: string;
  linkedAssetId?: string;
  linkedVendorId?: string;
  linkedProcessId?: string;
  type: 'TECHNOLOGICAL' | 'PHYSICAL' | 'GOVERNANCE';
  isGatekeeper: boolean;
  designScore: number;
  coverageScore: number;
  executionScore: number;
  rawWeight: number;
  hasException?: boolean;
  evidences: EvidenceFile[];
  auditLogs: AuditLogEvent[];
}

export interface FrameworkMapping {
  iso27001Code: string;
  iso27001Title: string;
  soc2Code: string;
  soc2Title: string;
}

export interface NistControl {
  code: string;
  category: string;
  function: 'GOVERN' | 'IDENTIFY' | 'PROTECT' | 'DETECT' | 'RESPOND' | 'RECOVER';
  title: string;
  description: string;
  mapping: FrameworkMapping;
  subControls: SubControl[];
}
export type RiskSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type ControlStatus = 'Implemented' | 'In Progress' | 'Not Implemented' | 'Under Review';

export interface RiskItem {
  id: string;
  title: string;
  category: string;
  impact: number; // 1-5
  likelihood: number; // 1-5
  score: number; // impact * likelihood
  severity: RiskSeverity;
  owner: string;
  mitigationPlan: string;
}

export interface ComplianceControl {
  id: string;
  framework: 'ISO 27001' | 'NIST CSF' | 'SOC 2' | 'GDPR';
  code: string;
  title: string;
  status: ControlStatus;
  owner: string;
  lastAuditDate: string;
}

export interface VendorAssessment {
  id: string;
  vendorName: string;
  serviceProvided: string;
  riskLevel: RiskSeverity;
  dueDiligenceStatus: 'Completed' | 'Pending Review' | 'Action Required';
  lastReviewed: string;
}