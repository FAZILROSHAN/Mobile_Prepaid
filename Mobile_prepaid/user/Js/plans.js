const plans = [
        // Recommended Plans
        { category: 'recommended', price: 299, validity: 28, data: 1.5, details: '1.5GB/day + Unlimited Calls + 100 SMS/day' },
        { category: 'recommended', price: 479, validity: 56, data: 1.5, details: '1.5GB/day + Unlimited Calls + 100 SMS/day' },
        { category: 'recommended', price: 599, validity: 84, data: 2, details: '2GB/day + Unlimited Calls + 100 SMS/day' },
        { category: 'recommended', price: 999, validity: 365, data: 1.5, details: '1.5GB/day + Unlimited Calls + 100 SMS/day' },
        
        // Popular Plans
        { category: 'popular', price: 399, validity: 28, data: 3, details: '3GB/day + Unlimited Calls + 100 SMS/day' },
        { category: 'popular', price: 719, validity: 84, data: 2, details: '2GB/day + Unlimited Calls + 100 SMS/day' },
        { category: 'popular', price: 839, validity: 84, data: 3, details: '3GB/day + Unlimited Calls + 100 SMS/day' },
        { category: 'popular', price: 1499, validity: 365, data: 2, details: '2GB/day + Unlimited Calls + 100 SMS/day' },
        
        // Combo Plans
        { category: 'combo', price: 999, validity: 90, data: 'Unlimited', details: 'Unlimited Data + Disney+ Hotstar' },
        { category: 'combo', price: 1199, validity: 365, data: 1.5, details: '1.5GB/day + Netflix Subscription' },
        { category: 'combo', price: 1799, validity: 365, data: 3, details: '3GB/day + Prime Video Subscription' },
        
        // Basic Plans
        { category: 'basic', price: 199, validity: 28, data: 1, details: '1GB/day + Unlimited Calls' },
        { category: 'basic', price: 149, validity: 24, data: 1, details: '1GB/day + 300 SMS' },
        { category: 'basic', price: 99, validity: 15, data: 1, details: '1GB/day + Calls @ 1p/sec' },
        
        // Long Term Plans
        { category: 'long_term', price: 2599, validity: 365, data: 2, details: '2GB/day + Unlimited Calls + 100 SMS/day' },
        { category: 'long_term', price: 2999, validity: 365, data: 3, details: '3GB/day + Unlimited Calls + 100 SMS/day' },
        { category: 'long_term', price: 3499, validity: 365, data: 'Unlimited', details: 'Unlimited Data + 100 SMS/day' },
        
        // Data Booster Plans
        { category: 'data_booster', price: 61, validity: 'NA', data: 6, details: '6GB Data Top-up' },
        { category: 'data_booster', price: 121, validity: 'NA', data: 12, details: '12GB Data Top-up' },
        { category: 'data_booster', price: 181, validity: 'NA', data: 20, details: '20GB Data Top-up' },
        { category: 'data_booster', price: 251, validity: 'NA', data: 30, details: '30GB Data Top-up' }
];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    checkRechargeSource();
    loadPhoneNumber();
    renderPlans(plans);
    initCategories();
});

// In checkRechargeSource function
function checkRechargeSource() {
    if (localStorage.getItem('cameFromrecharge') === 'true') {
        document.getElementById('rechargeSection').style.display = 'block';
        localStorage.removeItem('cameFromrecharge');
    }
}

function loadPhoneNumber() {
    const savedPhone = localStorage.getItem('phoneNumber');
    if (savedPhone) {
        document.getElementById('userPhone').textContent = savedPhone;
    }
}

function renderPlans(filteredPlans = plans) {
    const container = document.getElementById('plansContainer');
    container.innerHTML = '';
    
    filteredPlans.forEach(plan => {
        const card = `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card plan-card h-100">
                    <div class="card-body">
                        <h3 class="card-title">₹${plan.price}</h3>
                        <div class="d-flex justify-content-between mb-3">
                            <span class="badge bg-primary">${plan.category}</span>
                            <span><i class="far fa-calendar-alt me-1"></i>${plan.validity} Days</span>
                        </div>
                        <p class="card-text">
                            <i class="fas fa-wifi me-2"></i>${typeof plan.data === 'number' ? `${plan.data}GB/Day` : plan.data}
                        </p>
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary" 
                                    onclick="showPlanDetails('${plan.details}')">
                                <i class="fas fa-list-ul me-1"></i> View Details
                            </button>
                            <button class="btn btn-primary" 
                                    onclick="selectPlan(${plan.price})">
                                <i class="fa-solid fa-bolt"></i> Recharge Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Update the initCategories function to default to Recommended
function initCategories() {
    // Activate Recommended category by default
    document.querySelector('[data-category="recommended"]').classList.add('active');
    
    // Filter plans to show recommended initially
    renderPlans(plans.filter(p => p.category === 'recommended'));

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            const filtered = category === 'all' 
                ? plans 
                : plans.filter(p => p.category === category);
            
            renderPlans(filtered);
        });
    });
}

function showPlanDetails(details) {
    // Format details with icons for better visualization
    const formattedDetails = `
        <div class="plan-details-content">
            <div class="detail-item">
                <i class="fas fa-check-circle text-success me-2"></i> ${details}
            </div>
            <div class="detail-item">
                <i class="fas fa-clock text-warning me-2"></i> Activates immediately after purchase
            </div>
        </div>
    `;
    document.getElementById('planDetailsContent').innerHTML = formattedDetails;
    new bootstrap.Modal('#detailsModal').show();
}

// Phone number functions
let selectedPlanPrice = null;

function selectPlan(price) {
    selectedPlanPrice = price;
    const phone = localStorage.getItem('phoneNumber');
    
    if (phone) {
        proceedToPayment();
    } else {
        new bootstrap.Modal('#phoneModal').show();
    }
}

function savePhoneNumber() {
    const phoneInput = document.getElementById('phoneInput');
    const error = document.getElementById('phoneError');
    const phone = phoneInput.value.trim();

    if (!/^[6-9]\d{9}$/.test(phone)) {
        error.textContent = 'Invalid phone number! Must be 10 digits';
        return;
    }

    localStorage.setItem('phoneNumber', phone);
    loadPhoneNumber();
    
    if (selectedPlanPrice) {
        proceedToPayment();
    }
    
    bootstrap.Modal.getInstance('#phoneModal').hide();
}

function proceedToPayment() {
    localStorage.setItem('selectedPlan', JSON.stringify(
        plans.find(p => p.price === selectedPlanPrice)
    ));
    window.location.href = 'recharge_preview.html';
}

// Essential Search & Filter Functions
document.getElementById('searchInput').addEventListener('input', filterPlans);
document.getElementById('amountFilter').addEventListener('change', filterPlans);
document.getElementById('validityFilter').addEventListener('change', filterPlans);

function filterPlans() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const amount = document.getElementById('amountFilter').value;
    const validity = document.getElementById('validityFilter').value;

    const filtered = plans.filter(plan => {
        const matchesSearch = String(plan.price).includes(searchTerm) || 
                            String(plan.data).toLowerCase().includes(searchTerm);
        const matchesAmount = !amount || plan.price === parseInt(amount);
        const matchesValidity = !validity || plan.validity === parseInt(validity);
        
        return matchesSearch && matchesAmount && matchesValidity;
    });
    
    renderPlans(filtered);
}

// Essential Phone Number Change Functionality
function showPhoneModal(context) {
    const modal = new bootstrap.Modal('#phoneModal');
    if (context === 'change') {
        document.getElementById('phoneInput').value = localStorage.getItem('phoneNumber') || '';
    }
    modal.show();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize filters
    document.querySelectorAll('#searchInput, #amountFilter, #validityFilter')
           .forEach(el => el.addEventListener('input', filterPlans));
    
    // Load phone number if exists
    const savedPhone = localStorage.getItem('phoneNumber');
    if(savedPhone) {
        document.getElementById('userPhone').textContent = savedPhone;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    let loggedin = localStorage.getItem("loggedin") === "true";
    let logoutBtn = document.getElementById("logoutBtn");
    let logoutSection = document.getElementById("logout");

    if (logoutBtn && logoutSection) {
        if (loggedin) {
            logoutSection.style.display = "block";
            logoutBtn.style.display = "none";
        } else {
            logoutSection.style.display = "none";
            logoutBtn.style.display = "block";
        }
    }
});
let logoutSection=document.getElementById("logout");
logoutSection.addEventListener("click", () => {
    localStorage.removeItem("loggedin");
    window.location.reload(); // Refresh to update UI
});