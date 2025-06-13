export enum ComplaintStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export enum ComplaintPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum ComplaintCategory {
  DELIVERY = 'DELIVERY',
  PRODUCT_QUALITY = 'PRODUCT_QUALITY',
  PAYMENT = 'PAYMENT',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  OTHER = 'OTHER'
}

export interface Attachment {
  name: string;
  url: string;
  contentType: string;
}

export interface Complaint {
  _id?: string;
  userId?: string;
  userEmail: string;
  userName: string;
  subject: string;
  description: string;
  bookId?: string;
  bookTitle?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  category: ComplaintCategory;
  attachments?: Attachment[];
  adminResponse?: string;
  adminResponseDate?: Date;
  isResolved: boolean;
  resolvedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ComplaintStatistics {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  byCategory: { _id: string; count: number }[];
  byPriority: { _id: string; count: number }[];
}
