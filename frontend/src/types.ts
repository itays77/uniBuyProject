// Add the OrderStatus enum to match the backend
export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum ItemCountry {
  Israel = 'Israel',
  England = 'England',
  Spain = 'Spain',
  Germany = 'Germany',
  Italy = 'Italy',
  Brazil = 'Brazil',
  Argentina = 'Argentina',
  France = 'France',
  Portugal = 'Portugal',
  Netherlands = 'Netherlands',
  Belgium = 'Belgium',
}

export enum KitType {
  Home = 'Home',
  Away = 'Away',
  Third = 'Third',
}

export interface Item {
  _id: string;
  itemNumber: string;
  name: string;
  price: number;
  description?: string;
  country: string;
  kitType: string;
  season: string;
}

export interface OrderItem {
  itemNumber: string;
  name: string;
  price: number;
  country: string;
  kitType: string;
  season: string;
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentId?: string;
  paymentSessionId?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  auth0Id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
}
