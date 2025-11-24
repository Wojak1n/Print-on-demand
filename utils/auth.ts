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
    email: 'admin@khayali.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    joinDate: '2023-01-15',
    lastLogin: '2024-03-20',
    status: 'active',
    designCount: 0,
    orderCount: 0,
    totalSpent: 0
  },
  {
    id: 'user-1',
    email: 'sarah.johnson@example.com',
    password: 'password123',
    name: 'Sarah Johnson',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    joinDate: '2023-06-10',
    lastLogin: '2024-03-19',
    status: 'active',
    designCount: 24,
    orderCount: 18,
    totalSpent: 1245.50
  },
  {
    id: 'user-2',
    email: 'michael.chen@example.com',
    password: 'password123',
    name: 'Michael Chen',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    joinDate: '2023-08-22',
    lastLogin: '2024-03-18',
    status: 'active',
    designCount: 15,
    orderCount: 12,
    totalSpent: 890.00
  },
  {
    id: 'user-3',
    email: 'emma.davis@example.com',
    password: 'password123',
    name: 'Emma Davis',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    joinDate: '2023-09-05',
    lastLogin: '2024-03-20',
    status: 'active',
    designCount: 32,
    orderCount: 28,
    totalSpent: 2150.75
  },
  {
    id: 'user-4',
    email: 'david.martinez@example.com',
    password: 'password123',
    name: 'David Martinez',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    joinDate: '2023-10-12',
    lastLogin: '2024-03-15',
    status: 'active',
    designCount: 8,
    orderCount: 5,
    totalSpent: 425.00
  },
  {
    id: 'user-5',
    email: 'olivia.brown@example.com',
    password: 'password123',
    name: 'Olivia Brown',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia',
    joinDate: '2023-11-20',
    lastLogin: '2024-03-17',
    status: 'active',
    designCount: 19,
    orderCount: 14,
    totalSpent: 1050.25
  },
  {
    id: 'user-6',
    email: 'james.wilson@example.com',
    password: 'password123',
    name: 'James Wilson',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    joinDate: '2024-01-08',
    lastLogin: '2024-03-10',
    status: 'inactive',
    designCount: 3,
    orderCount: 2,
    totalSpent: 150.00
  },
  {
    id: 'user-7',
    email: 'sophia.taylor@example.com',
    password: 'password123',
    name: 'Sophia Taylor',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia',
    joinDate: '2024-02-14',
    lastLogin: '2024-03-19',
    status: 'active',
    designCount: 11,
    orderCount: 9,
    totalSpent: 675.50
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

