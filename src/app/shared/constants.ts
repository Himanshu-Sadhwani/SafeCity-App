export const API_BASE_URL = 'http://localhost:5097/api/v1';

export const TOKEN_KEY = 'safecity_token';
export const REFRESH_KEY = 'safecity_refresh';
export const USER_KEY = 'safecity_user';

export const ROLES = {
  CITIZEN: 'Citizen',
  POLICE: 'Police',
  FIRE_FIGHTER: 'Fire_Fighter',
  EMERGENCY_DISPATCHER: 'Emergency_Dispatcher',
  COMPLIANCE_OFFICER: 'Compliance_Officer',
  ADMIN: 'Admin',
} as const;

export const ROLE_LIST: { id: number; name: string; label: string }[] = [
  { id: 1, name: 'Citizen', label: 'Citizen' },
  { id: 2, name: 'Police', label: 'Police Officer' },
  { id: 3, name: 'Fire_Fighter', label: 'Fire Fighter' },
  { id: 4, name: 'Emergency_Dispatcher', label: 'Emergency Dispatcher' },
  { id: 5, name: 'Compliance_Officer', label: 'Compliance Officer' },
  { id: 6, name: 'Admin', label: 'City Administrator' },
];
