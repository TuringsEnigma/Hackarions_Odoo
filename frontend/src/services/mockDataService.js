// Comprehensive Mock Data Service for Expense Management System

// Mock Dashboard Statistics
export const getMockDashboardStats = (role) => {
  const baseStats = {
    pendingExpenses: 5,
    approvedExpenses: 12,
    rejectedExpenses: 3,
    totalAmount: 2500.0,
    thisMonthAmount: 1800.0,
    lastMonthAmount: 700.0,
    averageExpense: 125.0,
    totalUsers: 24,
    activeUsers: 18,
    recentExpenses: [],
    teamExpenses: [],
    approvalQueue: [],
    monthlyTrend: [
      { month: "Oct", amount: 1200 },
      { month: "Nov", amount: 1500 },
      { month: "Dec", amount: 1800 },
      { month: "Jan", amount: 2100 }
    ],
    categoryBreakdown: [
      { category: "Meals", amount: 800, count: 12 },
      { category: "Travel", amount: 1200, count: 8 },
      { category: "Office Supplies", amount: 300, count: 15 },
      { category: "Training", amount: 200, count: 3 }
    ]
  };

  switch (role?.toLowerCase()) {
    case "admin":
      return {
        ...baseStats,
        pendingExpenses: 8,
        approvedExpenses: 25,
        rejectedExpenses: 5,
        totalAmount: 12500.0,
        thisMonthAmount: 3200.0,
        totalUsers: 24,
        activeUsers: 18,
        recentExpenses: getMockRecentExpenses(10),
        teamExpenses: getMockTeamExpenses(8),
        approvalQueue: getMockApprovalQueue(6)
      };
    case "manager":
      return {
        ...baseStats,
        pendingExpenses: 3,
        approvedExpenses: 8,
        rejectedExpenses: 2,
        totalAmount: 3200.0,
        thisMonthAmount: 1200.0,
        recentExpenses: getMockRecentExpenses(5),
        teamExpenses: getMockTeamExpenses(6),
        approvalQueue: getMockApprovalQueue(4)
      };
    case "employee":
      return {
        ...baseStats,
        pendingExpenses: 2,
        approvedExpenses: 5,
        rejectedExpenses: 1,
        totalAmount: 1200.0,
        thisMonthAmount: 450.0,
        recentExpenses: getMockRecentExpenses(4),
        teamExpenses: [],
        approvalQueue: []
      };
    default:
      return baseStats;
  }
};

// Mock Recent Expenses
export const getMockRecentExpenses = (count = 5) => {
  const expenses = [
    {
      id: 1,
      description: "Business Lunch with Client",
      amount: 45.50,
      status: "Approved",
      date: "2024-01-15",
      category: "Meals",
      currency: "USD",
      employee: "John Doe",
      submittedBy: "john.doe@company.com",
      approvedBy: "Manager Smith",
      approvedAt: "2024-01-16"
    },
    {
      id: 2,
      description: "Taxi to Airport",
      amount: 25.00,
      status: "Pending",
      date: "2024-01-14",
      category: "Transportation",
      currency: "USD",
      employee: "Jane Smith",
      submittedBy: "jane.smith@company.com"
    },
    {
      id: 3,
      description: "Office Supplies - Printer Paper",
      amount: 120.75,
      status: "Rejected",
      date: "2024-01-13",
      category: "Office Supplies",
      currency: "USD",
      employee: "Mike Johnson",
      submittedBy: "mike.johnson@company.com",
      rejectionReason: "Receipt not provided"
    },
    {
      id: 4,
      description: "Client Dinner - Marketing Meeting",
      amount: 180.00,
      status: "Approved",
      date: "2024-01-12",
      category: "Meals",
      currency: "USD",
      employee: "Sarah Wilson",
      submittedBy: "sarah.wilson@company.com",
      approvedBy: "Manager Brown",
      approvedAt: "2024-01-13"
    },
    {
      id: 5,
      description: "Tech Conference Registration",
      amount: 350.00,
      status: "Pending",
      date: "2024-01-11",
      category: "Training",
      currency: "USD",
      employee: "Alex Brown",
      submittedBy: "alex.brown@company.com"
    },
    {
      id: 6,
      description: "Hotel Accommodation",
      amount: 280.00,
      status: "Approved",
      date: "2024-01-10",
      category: "Travel",
      currency: "USD",
      employee: "Lisa Davis",
      submittedBy: "lisa.davis@company.com",
      approvedBy: "Manager Wilson",
      approvedAt: "2024-01-11"
    },
    {
      id: 7,
      description: "Flight to New York",
      amount: 450.00,
      status: "Approved",
      date: "2024-01-09",
      category: "Travel",
      currency: "USD",
      employee: "Tom Wilson",
      submittedBy: "tom.wilson@company.com",
      approvedBy: "Manager Davis",
      approvedAt: "2024-01-10"
    },
    {
      id: 8,
      description: "Team Building Event",
      amount: 200.00,
      status: "Approved",
      date: "2024-01-08",
      category: "Entertainment",
      currency: "USD",
      employee: "Emma Johnson",
      submittedBy: "emma.johnson@company.com",
      approvedBy: "Manager Smith",
      approvedAt: "2024-01-09"
    },
    {
      id: 9,
      description: "Software License Renewal",
      amount: 299.00,
      status: "Pending",
      date: "2024-01-07",
      category: "Software",
      currency: "USD",
      employee: "David Lee",
      submittedBy: "david.lee@company.com"
    },
    {
      id: 10,
      description: "Client Gift Basket",
      amount: 75.00,
      status: "Approved",
      date: "2024-01-06",
      category: "Client Relations",
      currency: "USD",
      employee: "Maria Garcia",
      submittedBy: "maria.garcia@company.com",
      approvedBy: "Manager Brown",
      approvedAt: "2024-01-07"
    }
  ];
  
  return expenses.slice(0, count);
};

// Mock Team Expenses (for managers)
export const getMockTeamExpenses = (count = 5) => {
  return getMockRecentExpenses(count).map(expense => ({
    ...expense,
    teamMember: expense.employee,
    department: "Engineering",
    manager: "Manager Smith"
  }));
};

// Mock Approval Queue
export const getMockApprovalQueue = (count = 5) => {
  return getMockRecentExpenses(count)
    .filter(expense => expense.status === "Pending")
    .map(expense => ({
      ...expense,
      priority: Math.random() > 0.5 ? "High" : "Normal",
      daysPending: Math.floor(Math.random() * 7) + 1,
      approvalHistory: [
        {
          approver: "Manager Smith",
          action: "Assigned",
          date: expense.date,
          comment: "Assigned for review"
        }
      ]
    }));
};

// Mock Expense History with Filtering
export const getMockExpenseHistory = (filters = {}) => {
  let expenses = getMockRecentExpenses(20);
  
  // Apply filters
  if (filters.status) {
    expenses = expenses.filter(expense => 
      expense.status.toLowerCase() === filters.status.toLowerCase()
    );
  }
  
  if (filters.category) {
    expenses = expenses.filter(expense => 
      expense.category.toLowerCase() === filters.category.toLowerCase()
    );
  }
  
  if (filters.dateFrom) {
    expenses = expenses.filter(expense => 
      new Date(expense.date) >= new Date(filters.dateFrom)
    );
  }
  
  if (filters.dateTo) {
    expenses = expenses.filter(expense => 
      new Date(expense.date) <= new Date(filters.dateTo)
    );
  }
  
  if (filters.amountMin) {
    expenses = expenses.filter(expense => 
      expense.amount >= parseFloat(filters.amountMin)
    );
  }
  
  if (filters.amountMax) {
    expenses = expenses.filter(expense => 
      expense.amount <= parseFloat(filters.amountMax)
    );
  }
  
  // Apply sorting
  if (filters.sortBy) {
    expenses.sort((a, b) => {
      const aVal = a[filters.sortBy];
      const bVal = b[filters.sortBy];
      
      if (filters.sortOrder === "desc") {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });
  }
  
  return expenses;
};

// Mock Approval Rules
export const getMockApprovalRules = () => [
  {
    id: 1,
    name: "Standard Approval Flow",
    description: "Default approval process for all expenses",
    isActive: true,
    conditions: [
      {
        field: "amount",
        operator: ">=",
        value: 100,
        currency: "USD"
      }
    ],
    approvers: [
      { role: "Manager", order: 1, required: true },
      { role: "Admin", order: 2, required: false }
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15"
  },
  {
    id: 2,
    name: "High Value Expenses",
    description: "Special approval for expenses over $1000",
    isActive: true,
    conditions: [
      {
        field: "amount",
        operator: ">=",
        value: 1000,
        currency: "USD"
      }
    ],
    approvers: [
      { role: "Manager", order: 1, required: true },
      { role: "Admin", order: 2, required: true },
      { role: "Finance", order: 3, required: true }
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15"
  },
  {
    id: 3,
    name: "Travel Expenses",
    description: "Approval process for travel-related expenses",
    isActive: true,
    conditions: [
      {
        field: "category",
        operator: "==",
        value: "Travel"
      }
    ],
    approvers: [
      { role: "Manager", order: 1, required: true },
      { role: "HR", order: 2, required: true }
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15"
  }
];

// Mock OCR Results
export const getMockOCRResults = () => ({
  success: true,
  extractedData: {
    merchant: "Starbucks Coffee",
    date: "2024-01-15",
    amount: 12.50,
    currency: "USD",
    items: [
      { description: "Grande Latte", amount: 5.50 },
      { description: "Blueberry Muffin", amount: 3.25 },
      { description: "Tax", amount: 0.70 },
      { description: "Tip", amount: 3.05 }
    ],
    total: 12.50,
    confidence: 0.95
  },
  rawText: "Starbucks Coffee\n123 Main St\nGrande Latte $5.50\nBlueberry Muffin $3.25\nTax $0.70\nTip $3.05\nTotal $12.50"
});

// Mock Currency Data
export const getMockCurrencyData = () => ({
  base: "USD",
  rates: {
    "USD": 1.0,
    "EUR": 0.85,
    "GBP": 0.73,
    "JPY": 110.0,
    "CAD": 1.25,
    "AUD": 1.35,
    "CHF": 0.92,
    "CNY": 6.45,
    "INR": 75.0,
    "BRL": 5.20
  },
  lastUpdated: "2024-01-15T10:30:00Z"
});

// Mock Country Data
export const getMockCountryData = () => [
  { name: "United States", currency: "USD", code: "US" },
  { name: "United Kingdom", currency: "GBP", code: "GB" },
  { name: "Germany", currency: "EUR", code: "DE" },
  { name: "France", currency: "EUR", code: "FR" },
  { name: "Japan", currency: "JPY", code: "JP" },
  { name: "Canada", currency: "CAD", code: "CA" },
  { name: "Australia", currency: "AUD", code: "AU" },
  { name: "Switzerland", currency: "CHF", code: "CH" },
  { name: "China", currency: "CNY", code: "CN" },
  { name: "India", currency: "INR", code: "IN" },
  { name: "Brazil", currency: "BRL", code: "BR" }
];

// Mock Expense Categories
export const getMockExpenseCategories = () => [
  "Meals",
  "Travel",
  "Office Supplies",
  "Training",
  "Entertainment",
  "Transportation",
  "Software",
  "Client Relations",
  "Marketing",
  "Utilities",
  "Equipment",
  "Other"
];

// Mock Users for Admin Management
export const getMockUsers = () => [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Employee",
    department: "Engineering",
    manager: "Manager Smith",
    status: "Active",
    lastLogin: "2024-01-15",
    createdAt: "2023-06-01"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Manager",
    department: "Engineering",
    manager: "Admin User",
    status: "Active",
    lastLogin: "2024-01-15",
    createdAt: "2023-05-15"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Employee",
    department: "Marketing",
    manager: "Manager Brown",
    status: "Active",
    lastLogin: "2024-01-14",
    createdAt: "2023-07-01"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "Employee",
    department: "Sales",
    manager: "Manager Davis",
    status: "Active",
    lastLogin: "2024-01-15",
    createdAt: "2023-08-01"
  },
  {
    id: 5,
    name: "Alex Brown",
    email: "alex.brown@company.com",
    role: "Employee",
    department: "Engineering",
    manager: "Manager Smith",
    status: "Inactive",
    lastLogin: "2024-01-10",
    createdAt: "2023-09-01"
  }
];

// Mock Notification Data
export const getMockNotifications = () => [
  {
    id: 1,
    type: "approval_request",
    title: "New Expense Approval Request",
    message: "John Doe submitted a $45.50 expense for approval",
    timestamp: "2024-01-15T10:30:00Z",
    read: false,
    priority: "normal"
  },
  {
    id: 2,
    type: "expense_approved",
    title: "Expense Approved",
    message: "Your $120.75 office supplies expense has been approved",
    timestamp: "2024-01-15T09:15:00Z",
    read: true,
    priority: "low"
  },
  {
    id: 3,
    type: "expense_rejected",
    title: "Expense Rejected",
    message: "Your $85.00 client meeting expense was rejected. Reason: Missing receipt",
    timestamp: "2024-01-14T16:45:00Z",
    read: false,
    priority: "high"
  },
  {
    id: 4,
    type: "system_update",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2-4 AM EST",
    timestamp: "2024-01-14T14:00:00Z",
    read: true,
    priority: "normal"
  }
];

// Mock Reports Data
export const getMockReports = () => ({
  monthlyExpenses: [
    { month: "October 2023", total: 1200, count: 15 },
    { month: "November 2023", total: 1500, count: 18 },
    { month: "December 2023", total: 1800, count: 22 },
    { month: "January 2024", total: 2100, count: 25 }
  ],
  categoryBreakdown: [
    { category: "Meals", amount: 800, percentage: 38 },
    { category: "Travel", amount: 600, percentage: 29 },
    { category: "Office Supplies", amount: 300, percentage: 14 },
    { category: "Training", amount: 200, percentage: 10 },
    { category: "Other", amount: 200, percentage: 9 }
  ],
  topSpenders: [
    { employee: "John Doe", amount: 450, count: 8 },
    { employee: "Jane Smith", amount: 380, count: 6 },
    { employee: "Mike Johnson", amount: 320, count: 5 }
  ],
  approvalMetrics: {
    averageApprovalTime: "2.5 days",
    approvalRate: 85,
    rejectionRate: 15,
    totalApprovals: 45,
    pendingApprovals: 8
  }
});
