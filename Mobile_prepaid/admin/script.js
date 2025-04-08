const { jsPDF } = window.jspdf;

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');
const contentTitle = document.getElementById('content-title');
const loadingOverlay = document.getElementById('loadingOverlay');

// API Configuration
const API_BASE_URL = 'http://localhost:8083';
const USERS_API_BASE_URL = `${API_BASE_URL}/users`;
const CATEGORY_API_BASE_URL = `${API_BASE_URL}/categories`;
const PAYMENTS_API_BASE_URL = `${API_BASE_URL}/payments`;
const PLANS_API_BASE_URL = `${API_BASE_URL}/recharge-plans`;

// Pagination Configuration
const ITEMS_PER_PAGE = 10;
let currentPage = {
    users: 0,
    categories: 0,
    transactions: 0,
    plans: 0
};

// Data Cache
let allDataCache = {
    users: [],
    categories: [],
    transactions: [],
    plans: []
};

// Utility Functions
function showSuccess(message) {
    const msg = document.getElementById('success-message');
    msg.textContent = message;
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 3000);
}

async function fetchData(url) {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
        return [];
    }
    
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        showSuccess(`Error loading data: ${error.message}`);
        return [];
    }
}

// Pagination Functions
function renderPagination(sectionId, totalItems) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const container = document.getElementById(`${sectionId}-pagination`);
    
    if (!container) return;
    
    container.innerHTML = `
        <nav>
            <ul class="pagination">
                <li class="page-item ${currentPage[sectionId] === 0 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage('${sectionId}', ${currentPage[sectionId] - 1})">Previous</a>
                </li>
                ${Array.from({ length: totalPages }, (_, i) => `
                    <li class="page-item ${i === currentPage[sectionId] ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="changePage('${sectionId}', ${i})">${i + 1}</a>
                    </li>
                `).join('')}
                <li class="page-item ${currentPage[sectionId] >= totalPages - 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage('${sectionId}', ${currentPage[sectionId] + 1})">Next</a>
                </li>
            </ul>
        </nav>
    `;
}

function changePage(sectionId, newPage) {
    currentPage[sectionId] = newPage;
    renderPaginatedData(sectionId);
}

function renderPaginatedData(sectionId) {
    const startIdx = currentPage[sectionId] * ITEMS_PER_PAGE;
    const paginatedData = allDataCache[sectionId].slice(startIdx, startIdx + ITEMS_PER_PAGE);
    const tbody = document.querySelector(`#${sectionId}-table tbody`);
    
    tbody.innerHTML = paginatedData.length === 0 
        ? `<tr><td colspan="100%">No data found</td></tr>`
        : paginatedData.map(item => createTableRow(sectionId, item)).join('');

    renderPagination(sectionId, allDataCache[sectionId].length);
}

function createTableRow(sectionId, item) {
    switch(sectionId) {
        case 'users':
            return `<tr>
                <td>${item.username || 'N/A'}</td>
                <td>${item.phoneNumber || 'N/A'}</td>
                <td>${item.status || 'UNKNOWN'}</td>
                <td>
                    ${item.status === 'ACTIVE' 
                        ? '<span class="badge bg-success">Approved</span>' 
                        : `<button class="btn btn-sm btn-primary" onclick="approveKyc(${item.userId})">Approve</button>`}
                </td>
            </tr>`;
            
        case 'categories':
            return `<tr>
                <td>${item.categoryName || 'N/A'}</td>
                <td>${item.active ? 'Active' : 'Inactive'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editCategory(this, ${item.categoryId})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning me-1" onclick="toggleCategoryActive(${item.categoryId}, ${item.active})">
                        <i class="fas fa-toggle-${item.active ? 'off' : 'on'}"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory(${item.categoryId})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
            
        case 'transactions':
            const date = item.paymentDate ? new Date(item.paymentDate).toISOString().split('T')[0] : 'N/A';
            return `<tr>
                <td>${item.user?.phoneNumber || 'N/A'}</td>
                <td>${date}</td>
                <td>₹${item.amount?.toFixed(2) || '0.00'}</td>
            </tr>`;
            
        case 'plans':
            return `<tr>
                <td>${item.planName || 'N/A'}</td>
                <td>₹${item.price ? item.price.toFixed(2) : '0.00'}</td>
                <td>${item.validityDays || 'N/A'}</td>
                <td>${item.data || 'N/A'}</td>
                <td>${item.benefits || 'N/A'}</td>
                <td>${item.category?.categoryName || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editPlan(this, ${item.planId})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePlan(${item.planId})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
            
        default:
            return '';
    }
}

// Data Fetching Functions
async function fetchUsers() {
    try {
        loadingOverlay.style.display = 'flex';
        allDataCache.users = await fetchData(`${USERS_API_BASE_URL}/non-admin`);
        renderPaginatedData('users');
    } catch (error) {
        showSuccess(`Error loading users: ${error.message}`);
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

async function fetchCategories() {
    try {
        loadingOverlay.style.display = 'flex';
        allDataCache.categories = await fetchData(CATEGORY_API_BASE_URL);
        renderPaginatedData('categories');
        populateCategoryDropdown(allDataCache.categories.filter(c => c.active));
    } catch (error) {
        showSuccess(`Error loading categories: ${error.message}`);
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

async function fetchTransactions() {
    try {
        loadingOverlay.style.display = 'flex';
        allDataCache.transactions = await fetchData(PAYMENTS_API_BASE_URL);
        renderPaginatedData('transactions');
    } catch (error) {
        showSuccess(`Error loading transactions: ${error.message}`);
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

async function fetchPlans() {
    try {
        loadingOverlay.style.display = 'flex';
        allDataCache.plans = await fetchData(PLANS_API_BASE_URL);
        renderPaginatedData('plans');
    } catch (error) {
        showSuccess(`Error loading plans: ${error.message}`);
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// Category Functions
function populateCategoryDropdown(categories) {
    const select = document.getElementById('planCategory');
    select.innerHTML = '<option value="">Select a category</option>';
    categories.forEach(category => {
        select.innerHTML += `<option value="${category.categoryId}">${category.categoryName}</option>`;
    });
}

async function toggleCategoryActive(categoryId, isActive) {
    if (!confirm(`Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this category?`)) return;
    
    try {
        loadingOverlay.style.display = 'flex';
        const response = await fetch(`${CATEGORY_API_BASE_URL}/soft-delete/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify({ active: !isActive })
        });
        
        if (!response.ok) throw new Error('Failed to update category');
        showSuccess(`Category ${isActive ? 'deactivated' : 'activated'} successfully`);
        await fetchCategories();
    } catch (error) {
        showSuccess(`Error: ${error.message}`);
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to permanently delete this category?')) return;
    
    try {
        loadingOverlay.style.display = 'flex';
        const response = await fetch(`${CATEGORY_API_BASE_URL}/hard-delete/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete category');
        showSuccess('Category deleted successfully');
        await fetchCategories();
    } catch (error) {
        showSuccess(`Error: ${error.message}`);
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

function editCategory(btn, categoryId) {
    const row = btn.closest('tr');
    const cells = row.cells;
    const currentName = cells[0].textContent;

    cells[0].innerHTML = `<input type="text" value="${currentName}" class="form-control">`;
    btn.innerHTML = '<i class="fas fa-save"></i>';

    btn.onclick = async () => {
        const newName = cells[0].querySelector('input').value;
        try {
            loadingOverlay.style.display = 'flex';
            const response = await fetch(`${CATEGORY_API_BASE_URL}/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ categoryName: newName })
            });
            
            if (!response.ok) throw new Error('Failed to update category');
            showSuccess('Category updated successfully');
            await fetchCategories();
        } catch (error) {
            showSuccess(`Error: ${error.message}`);
        } finally {
            loadingOverlay.style.display = 'none';
        }
    };
}

// Plan Functions
async function createPlan() {
    const plan = {
        planName: document.getElementById('planName').value,
        price: parseFloat(document.getElementById('planPrice').value),
        validityDays: parseInt(document.getElementById('planValidity').value),
        data: document.getElementById('planData').value,
        benefits: document.getElementById('planBenefits').value,
        category: { categoryId: parseInt(document.getElementById('planCategory').value) }
    };

    try {
        loadingOverlay.style.display = 'flex';
        const response = await fetch(PLANS_API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(plan)
        });
        
        if (!response.ok) throw new Error('Failed to create plan');
        showSuccess('Plan created successfully');
        document.querySelector('#createPlanModal form').reset();
        bootstrap.Modal.getInstance(document.getElementById('createPlanModal')).hide();
        await fetchPlans();
    } catch (error) {
        showSuccess(`Error: ${error.message}`);
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

async function deletePlan(planId) {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
        loadingOverlay.style.display = 'flex';
        const response = await fetch(`${PLANS_API_BASE_URL}/${planId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete plan');
        showSuccess('Plan deleted successfully');
        await fetchPlans();
    } catch (error) {
        showSuccess(`Error: ${error.message}`);
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

function editPlan(btn, planId) {
    const row = btn.closest('tr');
    const cells = row.cells;

    const currentName = cells[0].textContent;
    const currentPrice = parseFloat(cells[1].textContent.replace('₹', ''));
    const currentValidity = parseInt(cells[2].textContent);
    const currentData = cells[3].textContent;
    const currentBenefits = cells[4].textContent;
    const currentCategoryName = cells[5].textContent;

    cells[0].innerHTML = `<input type="text" value="${currentName}" class="form-control">`;
    cells[1].innerHTML = `<input type="number" value="${currentPrice}" class="form-control" min="0">`;
    cells[2].innerHTML = `<input type="number" value="${currentValidity}" class="form-control" min="1">`;
    cells[3].innerHTML = `<input type="text" value="${currentData}" class="form-control">`;
    cells[4].innerHTML = `<input type="text" value="${currentBenefits}" class="form-control">`;
    cells[5].innerHTML = `<input type="text" value="${currentCategoryName}" class="form-control" disabled>`;
    btn.innerHTML = '<i class="fas fa-save"></i>';

    btn.onclick = async () => {
        const updatedPlan = {
            planId: planId,
            planName: cells[0].querySelector('input').value,
            price: parseFloat(cells[1].querySelector('input').value),
            validityDays: parseInt(cells[2].querySelector('input').value),
            data: cells[3].querySelector('input').value,
            benefits: cells[4].querySelector('input').value,
            category: { categoryId: parseInt(document.querySelector(`#plans-table tr td:contains('${currentCategoryName}')`).previousElementSibling.textContent) }
        };

        try {
            loadingOverlay.style.display = 'flex';
            const response = await fetch(`${PLANS_API_BASE_URL}/${planId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(updatedPlan)
            });
            
            if (!response.ok) throw new Error('Failed to update plan');
            showSuccess('Plan updated successfully');
            await fetchPlans();
        } catch (error) {
            showSuccess(`Error: ${error.message}`);
        } finally {
            loadingOverlay.style.display = 'none';
        }
    };
}

// User Functions
async function approveKyc(userId) {
    if (!confirm('Are you sure you want to approve this user?')) return;
    
    try {
        loadingOverlay.style.display = 'flex';
        const response = await fetch(`${USERS_API_BASE_URL}/${userId}/approve-kyc`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to approve KYC');
        showSuccess('User KYC approved successfully');
        await fetchUsers();
    } catch (error) {
        showSuccess(`Error: ${error.message}`);
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// UI Functions
function switchSection(sectionId) {
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    contentTitle.textContent = document.querySelector(`[data-section="${sectionId}"]`).textContent.trim() + ' Overview';

    if (sectionId === 'users') {
        fetchUsers();
    } else if (sectionId === 'plans') {
        fetchPlans();
    } else if (sectionId === 'transactions') {
        fetchTransactions();
    } else if (sectionId === 'categories') {
        fetchCategories();
    }
}

// Event Listeners
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        if (link.id === 'logout-btn') {
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html';
        } else {
            switchSection(link.getAttribute('data-section'));
        }
    });
});

document.getElementById('export-btn').addEventListener('click', () => {
    const activeSection = document.querySelector('.content-section:not([style*="display: none"])');
    const table = activeSection.querySelector('table');
    if (!table) return;

    const doc = new jsPDF();
    doc.text("Mobi Comm - " + contentTitle.textContent, 10, 10);
    doc.autoTable({ html: table, startY: 20 });
    doc.save(`${activeSection.id}_report.pdf`);
});

document.getElementById('savePlanBtn').addEventListener('click', createPlan);
document.getElementById('saveCategoryBtn').addEventListener('click', createCategory);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Create pagination containers
    ['users', 'categories', 'transactions', 'plans'].forEach(section => {
        if (!document.getElementById(`${section}-pagination`)) {
            const container = document.createElement('div');
            container.id = `${section}-pagination`;
            container.className = 'd-flex justify-content-center mt-3';
            document.getElementById(section).appendChild(container);
        }
    });

    // Check auth and load initial data
    if (!localStorage.getItem('adminToken')) {
        window.location.href = 'login.html';
    } else {
        fetchCategories();
    }
});

// Charts (keep your existing chart code)
const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
new Chart(userGrowthCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{ label: 'Users', data: [8000, 9000, 9500, 9800, 10000], borderColor: 'var(--secondary-color)', backgroundColor: 'rgba(99, 102, 241, 0.2)' }]
    },
    options: { scales: { y: { beginAtZero: true } } }
});

const revenueCtx = document.getElementById('revenueChart').getContext('2d');
new Chart(revenueCtx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{ label: 'Revenue', data: [1500000, 1800000, 2000000, 2200000, 2600000], backgroundColor: 'var(--primary-color)' }]
    },
    options: { scales: { y: { beginAtZero: true } } }
});