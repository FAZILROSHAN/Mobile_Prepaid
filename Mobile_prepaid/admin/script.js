const { jsPDF } = window.jspdf;

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');
const contentTitle = document.getElementById('content-title');
const loadingOverlay = document.getElementById('loadingOverlay');
const API_BASE_URL = 'http://localhost:8083/recharge-plans';
const CATEGORY_API_BASE_URL = 'http://localhost:8083/categories';

// Utility function to show success messages
function showSuccess(message) {
    const msg = document.getElementById('success-message');
    msg.textContent = message;
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 3000);
}

// Fetch and display all plans
async function fetchPlans() {
    try {
        loadingOverlay.style.display = 'flex';
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch plans');
        const plans = await response.json();
        const tbody = document.querySelector('#plans-table tbody');
        tbody.innerHTML = '';
        plans.forEach(plan => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${plan.planId}</td>
                <td>${plan.planName}</td>
                <td>₹${plan.price.toFixed(2)}</td>
                <td>${plan.validityDays}</td>
                <td>${plan.data}</td>
                <td>${plan.benefits}</td>
                <td>${plan.category.categoryId}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editPlan(this, ${plan.planId})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePlan(${plan.planId})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching plans:', error);
        showSuccess('Error loading plans. Please try again.');
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// Create a new plan
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
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('No admin token found. Please log in.');
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(plan)
        });
        if (!response.ok) throw new Error('Failed to create plan');
        const text = await response.text();
        showSuccess(text || 'Plan created successfully');
        fetchPlans();
        document.querySelector('#createPlanModal form').reset();
        bootstrap.Modal.getInstance(document.getElementById('createPlanModal')).hide();
    } catch (error) {
        console.error('Error creating plan:', error);
        showSuccess('Error creating plan. Please try again.');
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// Update an existing plan
async function updatePlan(planId, updatedPlan) {
    try {
        loadingOverlay.style.display = 'flex';
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('No admin token found. Please log in.');
        const response = await fetch(`${API_BASE_URL}/${planId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedPlan)
        });
        if (!response.ok) throw new Error('Failed to update plan');
        const text = await response.text();
        showSuccess(text || 'Plan updated successfully');
        fetchPlans();
    } catch (error) {
        console.error('Error updating plan:', error);
        showSuccess('Error updating plan. Please try again.');
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// Delete a plan
async function deletePlan(planId) {
    if (confirm('Are you sure you want to delete this plan?')) {
        try {
            loadingOverlay.style.display = 'flex';
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('No admin token found. Please log in.');
            const response = await fetch(`${API_BASE_URL}/${planId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete plan');
            const text = await response.text();
            showSuccess(text || 'Plan deleted successfully');
            fetchPlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
            showSuccess('Error deleting plan. Please try again.');
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }
}

// Edit plan function
function editPlan(btn, planId) {
    const row = btn.closest('tr');
    const cells = row.cells;

    const currentId = cells[0].textContent;
    const currentName = cells[1].textContent;
    const currentPrice = parseFloat(cells[2].textContent.replace('₹', ''));
    const currentValidity = parseInt(cells[3].textContent);
    const currentData = cells[4].textContent;
    const currentBenefits = cells[5].textContent;
    const currentCategoryId = parseInt(cells[6].textContent);

    cells[1].innerHTML = `<input type="text" value="${currentName}" class="form-control">`;
    cells[2].innerHTML = `<input type="number" value="${currentPrice}" class="form-control" min="0">`;
    cells[3].innerHTML = `<input type="number" value="${currentValidity}" class="form-control" min="1">`;
    cells[4].innerHTML = `<input type="text" value="${currentData}" class="form-control">`;
    cells[5].innerHTML = `<input type="text" value="${currentBenefits}" class="form-control">`;
    cells[6].innerHTML = `<input type="number" value="${currentCategoryId}" class="form-control" min="1">`;
    btn.innerHTML = '<i class="fas fa-save"></i>';

    btn.onclick = async () => {
        const newName = cells[1].querySelector('input').value;
        const newPrice = parseFloat(cells[2].querySelector('input').value);
        const newValidity = parseInt(cells[3].querySelector('input').value);
        const newData = cells[4].querySelector('input').value;
        const newBenefits = cells[5].querySelector('input').value;
        const newCategoryId = parseInt(cells[6].querySelector('input').value);

        const updatedPlan = {
            planId: currentId,
            planName: newName,
            price: newPrice,
            validityDays: newValidity,
            data: newData,
            benefits: newBenefits,
            category: { categoryId: newCategoryId }
        };

        await updatePlan(planId, updatedPlan);
        btn.innerHTML = '<i class="fas fa-edit"></i>';
        btn.onclick = () => editPlan(btn, planId);
    };
}

// Fetch and display all categories
async function fetchCategories() {
    try {
        loadingOverlay.style.display = 'flex';
        const response = await fetch(`${CATEGORY_API_BASE_URL}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch categories');
        const categories = await response.json();
        const tbody = document.querySelector('#categories-table tbody');
        tbody.innerHTML = '';
        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.categoryId}</td>
                <td>${category.categoryName}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editCategory(this, ${category.categoryId})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory(${category.categoryId})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
        // Update the dropdown in Create Plan modal
        populateCategoryDropdown(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        showSuccess('Error loading categories. Please try again.');
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// Populate category dropdown
function populateCategoryDropdown(categories) {
    const select = document.getElementById('planCategory');
    select.innerHTML = '<option value="">Select a category</option>';
    categories.forEach(category => {
        select.innerHTML += `<option value="${category.categoryId}">${category.categoryName}</option>`;
    });
}

// Create a new category
async function createCategory() {
    const category = {
        categoryName: document.getElementById('categoryName').value
    };
    try {
        loadingOverlay.style.display = 'flex';
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('No admin token found. Please log in.');
        const response = await fetch(`${CATEGORY_API_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(category)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to create category');
        }
        const text = await response.text();
        showSuccess(text || 'Category created successfully');
        fetchCategories();
        document.getElementById('categoryName').value = '';
        bootstrap.Modal.getInstance(document.getElementById('createCategoryModal')).hide();
    } catch (error) {
        console.error('Error creating category:', error);
        showSuccess(error.message || 'Error creating category. Please try again.');
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// Update an existing category
async function updateCategory(categoryId, updatedCategory) {
    try {
        loadingOverlay.style.display = 'flex';
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('No admin token found. Please log in.');
        const response = await fetch(`${CATEGORY_API_BASE_URL}/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedCategory)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to update category');
        }
        const text = await response.text();
        showSuccess(text || 'Category updated successfully');
        fetchCategories();
    } catch (error) {
        console.error('Error updating category:', error);
        showSuccess(error.message || 'Error updating category. Please try again.');
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// Delete a category
async function deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category? Related plans may be affected.')) {
        try {
            loadingOverlay.style.display = 'flex';
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('No admin token found. Please log in.');
            const response = await fetch(`${CATEGORY_API_BASE_URL}/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to delete category');
            }
            const text = await response.text();
            showSuccess(text || 'Category deleted successfully');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            showSuccess(error.message || 'Error deleting category. Please try again.');
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }
}

// Edit category function
function editCategory(btn, categoryId) {
    const row = btn.closest('tr');
    const cells = row.cells;

    const currentName = cells[1].textContent;

    cells[1].innerHTML = `<input type="text" value="${currentName}" class="form-control">`;
    btn.innerHTML = '<i class="fas fa-save"></i>';

    btn.onclick = async () => {
        const newName = cells[1].querySelector('input').value;
        const updatedCategory = { categoryName: newName };
        await updateCategory(categoryId, updatedCategory);
        btn.innerHTML = '<i class="fas fa-edit"></i>';
        btn.onclick = () => editCategory(btn, categoryId);
    };
}

// Hook up the "Create Plan" modal
document.getElementById('savePlanBtn').addEventListener('click', async () => {
    await createPlan();
});

// Hook up the "Create Category" modal
document.getElementById('saveCategoryBtn').addEventListener('click', async () => {
    await createCategory();
});

// Switch sections
function switchSection(sectionId) {
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    contentTitle.textContent = document.querySelector(`[data-section="${sectionId}"]`).textContent.trim() + ' Overview';

    if (sectionId === 'plans') {
        fetchPlans();
    } else if (sectionId === 'categories') {
        fetchCategories();
    }
}

// Navigation link event listeners
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

// Export report
document.getElementById('export-btn').addEventListener('click', () => {
    const activeSection = document.querySelector('.content-section:not([style*="display: none"])');
    const table = activeSection.querySelector('table');
    if (!table) return;

    const doc = new jsPDF();
    doc.text("Mobi Comm - " + contentTitle.textContent, 10, 10);
    doc.autoTable({ html: table, startY: 20 });
    doc.save(`${activeSection.id}_report.pdf`);
});

// Initial check for token and fetch categories
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
    }
    fetchCategories(); // Fetch categories to populate dropdown initially
    if (document.querySelector('.nav-link.active').getAttribute('data-section') === 'plans') {
        fetchPlans();
    }
});

// Logout handler
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
});

// Charts
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