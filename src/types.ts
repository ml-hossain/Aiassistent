export interface JsonRecord {
  id?: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}
