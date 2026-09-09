export interface User {
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  description: string;
}
