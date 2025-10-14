// Member Types
export interface Member {
  id: number;
  code: string;
  fullName: string;
  email: string;
  position?: string;
  experienceMonths?: number;
  employmentType?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemberFormData {
  code: string;
  fullName: string;
  email: string;
  position?: string;
  experienceMonths?: number;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract';
  isActive?: boolean;
}

// Assessment Types
export interface Assessment {
  id: number;
  timestamp: string;
  respondentCode: string;
  fillTimeMinutes?: number;
  leadership?: Record<string, number>;
  expertise?: Record<string, number>;
  collaboration?: Record<string, number>;
  innovation?: Record<string, number>;
  reliability?: Record<string, number>;
  communication?: Record<string, number>;
  adaptability?: Record<string, number>;
  mentorship?: Record<string, number>;
  selfLeadership?: Record<string, number>;
  selfExpertise?: Record<string, number>;
  selfCollaboration?: Record<string, number>;
  competencyMatrix?: any;
  frequentCollaboration?: string[];
  desiredCollaboration?: string[];
  learningSources?: string[];
  teamTrustIndex?: number;
  psychologicalSafety?: number;
  roleSatisfaction?: number;
  createdAt: string;
}

export interface AssessmentFormData {
  respondentCode: string;
  fillTimeMinutes?: number;
  leadership?: Record<string, number>;
  expertise?: Record<string, number>;
  collaboration?: Record<string, number>;
  innovation?: Record<string, number>;
  reliability?: Record<string, number>;
  communication?: Record<string, number>;
  adaptability?: Record<string, number>;
  mentorship?: Record<string, number>;
  selfLeadership?: Record<string, number>;
  selfExpertise?: Record<string, number>;
  selfCollaboration?: Record<string, number>;
  competencyMatrix?: any;
  frequentCollaboration?: string[];
  desiredCollaboration?: string[];
  learningSources?: string[];
  teamTrustIndex?: number;
  psychologicalSafety?: number;
  roleSatisfaction?: number;
}

// Metric Types
export interface Metric {
  id: number;
  memberCode: string;
  assessmentId: number;
  meanRankLeadership?: number;
  meanRankExpertise?: number;
  stdLeadership?: number;
  stdExpertise?: number;
  top3CountLeadership?: number;
  statusScore?: number;
  maeLeadership?: number;
  biasLeadership?: number;
  accuracyLeadership?: number;
  updatedAt: string;
}

// Auth Types
export interface User {
  id: number;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ViewerAuthResponse {
  access: boolean;
  token: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Visualization Types
export interface Node3D {
  code: string;
  position: [number, number, number];
  color: string;
  size: number;
  member: Member;
}

export interface Connection3D {
  from: string;
  to: string;
  strength: number;
  positive: boolean;
  mutual: boolean;
}

export interface NetworkNode {
  id: string;
  label: string;
  value: number;
  color: string;
  data: Member;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
  color: string;
}
