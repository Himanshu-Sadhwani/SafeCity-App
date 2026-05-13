// Shared DTO interfaces matching the SafeCity backend.

export interface LoginRequest { email: string; password: string; }
export interface LoginResponseBody {
  message: string;
  data: { accessToken: string; refreshToken: string; expires: string; };
}

export interface RegisterRequest {
  name: string;
  roleID: number;
  email: string;
  phone: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserView {
  userId: number;
  userName: string;
  email: string;
  phone: string;
  status: string;
  roleName: string;
}

export interface UserUpdateRequest {
  name: string;
  phone: string;
  roleID: number;
  status: number; // UserStatus: 0=Active,1=Inactive
}

export interface Incident {
  incidentID: number;
  citizenID: number;
  type: string;
  location: string;
  date: string;
  status: string;
}
export interface IncidentCreateRequest {
  citizenID: number;
  type: number; // IncidentOption
  location: string;
  date: string;
  status: number; // ignored server side
}

export interface CaseItem {
  caseID: number;
  incidentID: number;
  assignedOfficerID: number;
  description: string;
  status: string;
  resolutionDate: string;
}
export interface CaseCreateRequest {
  incidentID: number;
  assignedOfficerID: number;
  description: string;
}

export interface Patrol {
  patrolId: number;
  officerId: number;
  area: string;
  date: string;
  status: string;
}
export interface PatrolCreateRequest {
  officerId: number;
  area: string;
  date: string;
}
export interface AvailableOfficer {
  officerId: number;
  name: string;
  email: string;
  phone: string;
}

export interface FieldReport {
  reportId: number;
  patrolId: number;
  notes: string;
  date: string;
  status: string;
}
export interface FieldReportCreateRequest {
  patrolId: number;
  notes: string;
  date: string;
}
export interface FieldReportUpdateRequest {
  notes?: string;
  status?: number; // FieldReportStatus
}

export interface DispatchRecord {
  dispatchID: number;
  incidentId: number;
  dispatcherId: number;
  dispatcherName: string;
  resourceId: number;
  date: string;
  status: string;
}

export interface ResourceItem {
  resourceID: number;
  type: string;
  availability: string;
  location: string;
  unitName: string;
}

export interface Audit {
  auditID: number;
  officerID: number;
  scope: string;
  findings: string;
  date: string;
  status: string;
}
export interface AuditCreateRequest {
  officerID: number;
  scope: number; // AuditScope
  findings: string;
  status: number; // AuditStatus
}

export interface ComplianceItem {
  complianceID: number;
  entityID: number;
  type: string;
  result: string;
  date: string;
  notes: string;
}
export interface ComplianceCreateRequest {
  entityId: number;
  type: number; // ComplianceType
  result: number; // ComplianceResult
  notes: string;
}

export interface Crisis {
  crisisID: number;
  type: string;
  location: string;
  date: string;
  severity: string;
  status: string;
}
export interface CrisisCreateRequest {
  type: number; // CrisisType
  location: string;
  date: string;
  severity: number; // CrisisSeverity
  status?: number; // CrisisStatus
}

export interface CrisisResponseItem {
  crisisId: number;
  location: string;
  severity: string;
  status: string;
  isResponseAssigned: boolean;
  teamId?: number;
  actions: string;
}
export interface AssignResponseTeamRequest {
  crisisId: number;
  teamId: number;
  actions: string;
}

export interface NotificationRequest {
  event: string;
  targetGroup: string;
  payload: any;
}

// Enum dictionaries for dropdowns
export const INCIDENT_TYPES = [
  { value: 1, label: 'Crime' },
  { value: 2, label: 'Fire' },
  { value: 3, label: 'Accident' },
  { value: 4, label: 'Other' },
];
export const INCIDENT_STATUSES = [
  { value: 1, label: 'Pending' },
  { value: 2, label: 'InProgress' },
  { value: 3, label: 'Resolved' },
];
export const PATROL_STATUSES = [
  { value: 0, label: 'Active' },
  { value: 1, label: 'OnPatrol' },
  { value: 2, label: 'Inactive' },
];
export const FIELD_REPORT_STATUSES = [
  { value: 0, label: 'Draft' },
  { value: 1, label: 'Submitted' },
  { value: 2, label: 'InReview' },
  { value: 3, label: 'Approved' },
  { value: 4, label: 'Rejected' },
  { value: 5, label: 'Closed' },
];
export const AUDIT_SCOPES = [
  { value: 0, label: 'Department' },
  { value: 1, label: 'Facility' },
  { value: 2, label: 'System' },
  { value: 3, label: 'Organization' },
  { value: 4, label: 'Incident' },
];
export const AUDIT_STATUSES = [
  { value: 0, label: 'Draft' },
  { value: 1, label: 'Finalized' },
  { value: 2, label: 'Archived' },
];
export const COMPLIANCE_TYPES = [
  { value: 0, label: 'Incident' },
  { value: 1, label: 'Dispatch' },
];
export const COMPLIANCE_RESULTS = [
  { value: 0, label: 'Pass' },
  { value: 1, label: 'Fail' },
];
export const CRISIS_TYPES = [
  { value: 0, label: 'Flood' },
  { value: 1, label: 'Earthquake' },
  { value: 2, label: 'Fire' },
];
export const CRISIS_SEVERITIES = [
  { value: 0, label: 'Low' },
  { value: 1, label: 'Medium' },
  { value: 2, label: 'High' },
];
export const CRISIS_STATUSES = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'Active' },
  { value: 2, label: 'Stabilized' },
  { value: 3, label: 'Resolved' },
  { value: 4, label: 'Closed' },
  { value: 5, label: 'Cancelled' },
];
export const DISPATCH_STATUSES = [
  { value: 1, label: 'Assigned' },
  { value: 2, label: 'EnRoute' },
  { value: 3, label: 'OnSite' },
  { value: 4, label: 'Resolved' },
  { value: 5, label: 'Cancelled' },
];
export const USER_STATUSES = [
  { value: 0, label: 'Active' },
  { value: 1, label: 'Inactive' },
];
