export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'SUPPORT_AGENT';
  firstName: string;
  lastName: string;
}

export interface Merchant {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  registrationDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  merchantId: string;
  merchantName: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  title: string;
  description: string;
  dateRaised: string;
  lastUpdated: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  slaDeadline: string;
  attachments: Attachment[];
  notes: TicketNote[];
  resolutionTime?: number;
}

export interface TicketNote {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export type TicketCategory = 
  | 'DEVICE_ISSUE' 
  | 'PAYMENT_ISSUE' 
  | 'AD_MANAGEMENT' 
  | 'BILLING' 
  | 'OTHER';

export type TicketStatus = 
  | 'OPEN' 
  | 'IN_PROGRESS' 
  | 'RESOLVED' 
  | 'CLOSED';

export type TicketPriority = 
  | 'NORMAL' 
  | 'URGENT';

export interface DashboardStats {
  openTickets: number;
  inProgressTickets: number;
  slaBreaches: number;
  totalTickets: number;
  avgResolutionTime: number;
  customerSatisfaction: number;
}

export interface CategoryConfig {
  id: string;
  name: string;
  description: string;
  slaHours: number;
  isActive: boolean;
}

export interface SLAConfig {
  id: string;
  category: TicketCategory;
  responseTimeHours: number;
  resolutionTimeHours: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TicketFilters {
  status?: TicketStatus[];
  category?: TicketCategory[];
  priority?: TicketPriority[];
  assignedAgentId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}