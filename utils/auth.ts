export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  joinDate: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'suspended';
  designCount?: number;
  orderCount?: number;
  totalSpent?: number;
}

export const FAKE_USERS: User[] = [
  {
    id: 'admin-1',
    email: 'hafsa@admin.com',
    password: 'hafsa123',
    name: 'Hafsa',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hafsa',
    joinDate: '2023-01-15',
    lastLogin: '2024-03-20',
    status: 'active',
    designCount: 0,
    orderCount: 0,
    totalSpent: 0
  },
  {
    id: 'user-1',
    email: 'wafae@user.com',
    password: 'wafae123',
    name: 'Wafae',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wafae',
    joinDate: '2023-06-10',
    lastLogin: '2024-03-19',
    status: 'active',
    designCount: 12,
    orderCount: 8,
    totalSpent: 650.00
  },
  {
    id: 'user-2',
    email: 'mohamed@user.com',
    password: 'mohamed123',
    name: 'Mohamed',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohamed',
    joinDate: '2023-08-22',
    lastLogin: '2024-03-18',
    status: 'active',
    designCount: 15,
    orderCount: 10,
    totalSpent: 890.00
  }
];

// Authentication helper functions
export const authenticateUser = (email: string, password: string): User | null => {
  const user = FAKE_USERS.find(u => u.email === email && u.password === password);
  return user || null;
};

export const getCurrentUser = (): User | null => {
  const userEmail = localStorage.getItem('userEmail');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn || !userEmail) return null;
  
  const user = FAKE_USERS.find(u => u.email === userEmail);
  return user || null;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const logout = (): void => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userType');
  localStorage.removeItem('userName');
};

export const login = (user: User): void => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('userType', user.role);
  localStorage.setItem('userName', user.name);
};

