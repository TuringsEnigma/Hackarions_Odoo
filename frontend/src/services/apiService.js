import { useAuthStore } from '../hooks/useAuthStore';

// NOTE: Replace this with the actual URL where your Node/Express server is running
const API_BASE_URL = 'http://localhost:5000'; 

// Function to get the Authorization header from the global state
const getAuthHeaders = () => {
    // 🚨 Retrieve the token from the useAuthStore
    const token = useAuthStore.getState().user?.token;
    
    return {
        'Content-Type': 'application/json',
        // Only include Authorization header if a token exists
        ...(token && { 'Authorization': `Bearer ${token}` }), 
    };
};

// =========================================================================
// 1. Authentication Endpoints
// =========================================================================

export async function signIn(email, password) {
    const url = `${API_BASE_URL}/auth/login`; // Assuming this is your login endpoint
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed due to server error.');
        }

        // Assuming the backend returns: { token, user: { id, role, email, etc. } }
        return {
            token: data.token, 
            user: { ...data.user, token: data.token } // Store token inside user object for easy access
        };

    } catch (error) {
        console.error("API Sign In Error:", error);
        throw error;
    }
}

export async function signUpAdmin(formData) {
    const url = `${API_BASE_URL}/auth/signup-admin`; // Assuming dedicated admin signup endpoint

    const body = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'Admin',
        company_currency: formData.countryCurrency,
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Admin signup failed.');
        }
        
        // Return successful registration data
        return {
            token: data.token,
            user: { ...data.user, token: data.token } 
        };

    } catch (error) {
        console.error("API Admin Signup Error:", error);
        throw error;
    }
}

export async function sendPassword(userId) {
    const url = `${API_BASE_URL}/auth/forgot-password`; 
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ user_id: userId }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to send temporary password.');
        }
        return true; 
        
    } catch (error) {
        console.error("API Send Password Error:", error);
        throw error;
    }
}

// =========================================================================
// 2. Admin Management Endpoints
// =========================================================================

export async function fetchAllUsers() {
    const url = `${API_BASE_URL}/users`; 
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch users.');
        }

        const data = await response.json();
        
        // Map backend response for front-end structure
        return data.map(user => ({
            id: user.user_id,
            name: user.email.split('@')[0], // Use first part of email as name for now
            email: user.email,
            role: user.role,
            managerName: user.manager_email ? user.manager_email.split('@')[0] : null,
            managerEmail: user.manager_email,
            managerId: null, // This ID is set client-side in AdminUsersPage.jsx
        }));

    } catch (error) {
        console.error("API Fetch Users Error:", error);
        throw error;
    }
}

export async function createUser(formData) {
    const url = `${API_BASE_URL}/users`; 
    const companyId = useAuthStore.getState().user?.company_id || 'DEFAULT'; // Retrieve company_id
    
    // Data structure expected by your Node/Express backend
    const body = {
        username: formData.name, 
        email: formData.email,
        role: formData.role,
        manager_id: formData.managerId || null, 
        company_id: companyId,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create user.');
        }
        
        // Return structure for front-end table update
        return {
            id: data.user_id,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            managerId: formData.managerId,
            managerName: 'Resolving Manager...',
        };

    } catch (error) {
        console.error("API Create User Error:", error);
        throw error;
    }
}

export async function updateUser(userData) {
    const url = `${API_BASE_URL}/admin/users/${userData.id}`; 
    
    try {
        const response = await fetch(url, {
            method: 'PUT', // Assuming PUT/PATCH for updates
            headers: getAuthHeaders(),
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update user.');
        }
        return true;

    } catch (error) {
        console.error("API Update User Error:", error);
        throw error;
    }
}

// =========================================================================
// 3. Expense Management Endpoints
// =========================================================================

export async function submitExpense(expenseData) {
    const url = `${API_BASE_URL}/api/expenses`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(expenseData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit expense.');
        }
        
        return data;

    } catch (error) {
        console.error("API Submit Expense Error:", error);
        throw error;
    }
}

export async function fetchExpenses(filters = {}) {
    const url = `${API_BASE_URL}/api/expenses`;
    const queryParams = new URLSearchParams(filters);
    const fullUrl = queryParams.toString() ? `${url}?${queryParams}` : url;
    
    try {
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch expenses.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API Fetch Expenses Error:", error);
        throw error;
    }
}

export async function fetchExpenseById(expenseId) {
    const url = `${API_BASE_URL}/api/expenses/${expenseId}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch expense.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API Fetch Expense Error:", error);
        throw error;
    }
}

export async function approveExpense(expenseId, comment = '') {
    const url = `${API_BASE_URL}/api/expenses/${expenseId}/approve`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ comment }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to approve expense.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API Approve Expense Error:", error);
        throw error;
    }
}

export async function rejectExpense(expenseId, comment = '') {
    const url = `${API_BASE_URL}/api/expenses/${expenseId}/reject`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ comment }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to reject expense.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API Reject Expense Error:", error);
        throw error;
    }
}

export async function fetchDashboardStats() {
    const url = `${API_BASE_URL}/dashboard/stats`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch dashboard stats.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API Dashboard Stats Error:", error);
        throw error;
    }
}

export async function uploadReceipt(file) {
    const url = `${API_BASE_URL}/api/expenses/upload-receipt`;
    
    const formData = new FormData();
    formData.append('receipt', file);
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${useAuthStore.getState().user?.token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload receipt.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API Upload Receipt Error:", error);
        throw error;
    }
}

export async function processOCR(file) {
    const url = `${API_BASE_URL}/api/expenses/process-ocr`;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${useAuthStore.getState().user?.token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to process OCR.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API Process OCR Error:", error);
        throw error;
    }
}

// =========================================================================
// 4. Approval Rules Management Endpoints
// =========================================================================

export async function fetchApprovalRules() {
    const url = `${API_BASE_URL}/admin/approval-rules`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch approval rules.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API Fetch Approval Rules Error:", error);
        throw error;
    }
}

export async function createApprovalRule(ruleData) {
    const url = `${API_BASE_URL}/admin/approval-rules`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(ruleData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create approval rule.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API Create Approval Rule Error:", error);
        throw error;
    }
}

export async function updateApprovalRule(ruleId, ruleData) {
    const url = `${API_BASE_URL}/admin/approval-rules/${ruleId}`;
    
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(ruleData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update approval rule.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API Update Approval Rule Error:", error);
        throw error;
    }
}

export async function deleteApprovalRule(ruleId) {
    const url = `${API_BASE_URL}/admin/approval-rules/${ruleId}`;
    
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete approval rule.');
        }

        return true;

    } catch (error) {
        console.error("API Delete Approval Rule Error:", error);
        throw error;
    }
}