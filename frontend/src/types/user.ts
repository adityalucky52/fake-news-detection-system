export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  prediction_count?: number;
}
