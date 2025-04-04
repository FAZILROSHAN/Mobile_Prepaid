document.addEventListener("DOMContentLoaded", () => {
    checkRechargeSource();
    loadPhoneNumber();
    fetchRechargePlans();
    initCategories();
});

let plans = [];
const BASE_URL = "http://localhost:8083/recharge-plans";

// Map frontend category names to backend category IDs (update these IDs based on your Categories table)
const categoryMap = {
    "all": null,          // No filter for "All"
    "recommended": 1,
    "popular": 2,
    "combo": 3,
    "basic": 4,
    "long_term": 5,
    "data_booster": 6
};

function fetchRechargePlans() {
    fetch(`${BASE_URL}`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch plans");
            return response.json();
        })
        .then(data => {
            console.log("Fetched Plans from Backend:", data);
            plans = data;
            renderPlans(plans); // Show all plans by default
        })
        .catch(error => console.error("Error fetching plans:", error));
}

function renderPlans(filteredPlans) {
    const container = document.getElementById("plansContainer");
    container.innerHTML = "";

    if (filteredPlans.length === 0) {
        container.innerHTML = '<p>No plans available.</p>';
        return;
    }

    filteredPlans.forEach(plan => {
        const categoryName = Object.keys(categoryMap).find(key => categoryMap[key] === plan.category.categoryId) || "General";
        const card = `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card plan-card h-100">
                    <div class="card-body">
                        <h3 class="card-title">₹${plan.price}</h3>
                        <div class="d-flex justify-content-between mb-3">
                            <span class="badge bg-primary">${categoryName}</span>
                            <span><i class="far fa-calendar-alt me-1"></i>${plan.validityDays} Days</span>
                        </div>
                        <p class="card-text"><i class="fas fa-wifi me-2"></i>${plan.data}</p>
                        <p class="card-text"><i class="fas fa-gift me-2"></i>${plan.benefits}</p>
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary" onclick="showPlanDetails('${plan.planName}', '${plan.data}', '${plan.benefits}')">
                                <i class="fas fa-list-ul me-1"></i> View Details
                            </button>
                            <button class="btn btn-primary" onclick="selectPlan(${plan.planId})">
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

function showPlanDetails(planName, data, benefits) {
    const formattedDetails = `
        <div class="plan-details-content">
            <div class="detail-item">
                <i class="fas fa-check-circle text-success me-2"></i> ${planName}
            </div>
            <div class="detail-item">
                <i class="fas fa-wifi text-primary me-2"></i> Data: ${data}
            </div>
            <div class="detail-item">
                <i class="fas fa-gift text-info me-2"></i> Benefits: ${benefits}
            </div>
            <div class="detail-item">
                <i class="fas fa-clock text-warning me-2"></i> Activates immediately after purchase
            </div>
        </div>
    `;
    document.getElementById("planDetailsContent").innerHTML = formattedDetails;
    new bootstrap.Modal("#detailsModal").show();
}

function initCategories() {
    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            const category = this.dataset.category;
            const categoryId = categoryMap[category];
            fetchPlansByCategory(categoryId);
        });
    });
}

function fetchPlansByCategory(categoryId) {
    const url = categoryId ? `${BASE_URL}/filter?categoryId=${categoryId}` : `${BASE_URL}`;
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch plans by category");
            return response.json();
        })
        .then(data => {
            renderPlans(data);
        })
        .catch(error => {
            console.error("Error fetching plans by category:", error);
            renderPlans([]);
        });
}

function checkRechargeSource() {
    if (localStorage.getItem("cameFromrecharge") === "true") {
        document.getElementById("rechargeSection").style.display = "block";
        localStorage.removeItem("cameFromrecharge");
    }
}

function loadPhoneNumber() {
    const savedPhone = localStorage.getItem("phoneNumber");
    if (savedPhone) {
        document.getElementById("userPhone").textContent = savedPhone;
    }
}

document.getElementById("searchInput").addEventListener("input", applySearchAndFilters);
document.getElementById("minAmount").addEventListener("input", applySearchAndFilters);
document.getElementById("maxAmount").addEventListener("input", applySearchAndFilters);
document.getElementById("validityFilter").addEventListener("change", applySearchAndFilters);

function applySearchAndFilters() {
    const searchTerm = document.getElementById("searchInput").value.trim();
    const minAmount = document.getElementById("minAmount").value.trim();
    const maxAmount = document.getElementById("maxAmount").value.trim();
    const validity = document.getElementById("validityFilter").value;

    let url = `${BASE_URL}`;
    const params = new URLSearchParams();

    if (searchTerm) {
        url += "/search";
        if (!isNaN(searchTerm)) params.append("price", searchTerm);
        else if (searchTerm.toLowerCase().includes("gb")) params.append("data", searchTerm);
        else params.append("benefits", searchTerm);
    } else if (minAmount || maxAmount || validity) {
        url += "/filter";
        if (minAmount) params.append("min", minAmount);
        if (maxAmount) params.append("max", maxAmount);
        if (validity) params.append("days", validity);
    }

    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch filtered plans");
            return response.json();
        })
        .then(data => {
            renderPlans(data);
        })
        .catch(error => {
            console.error("Error applying search/filters:", error);
            renderPlans([]);
        });
}

let selectedPlanId = null;

function selectPlan(planId) {
    selectedPlanId = planId;
    const phone = localStorage.getItem("phoneNumber");

    if (phone) {
        proceedToPayment();
    } else {
        new bootstrap.Modal("#phoneModal").show();
    }
}

function savePhoneNumber() {
    const phoneInput = document.getElementById("phoneInput");
    const error = document.getElementById("phoneError");
    const phone = phoneInput.value.trim();

    if (!/^[6-9]\d{9}$/.test(phone)) {
        error.textContent = "Invalid phone number! Must be 10 digits starting with 6-9.";
        return;
    }

    error.textContent = "";
    fetch(`http://localhost:8083/users/validate/${phone}`)
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(result => {
            if (result.status === 200) {
                localStorage.setItem("phoneNumber", phone);
                localStorage.setItem("userId", result.body.userId);
                localStorage.setItem("username",result.body.username);
                loadPhoneNumber();
                bootstrap.Modal.getInstance("#phoneModal").hide();
                if (selectedPlanId) proceedToPayment();
            } else {
                error.textContent = result.body || "This number is not eligible for recharge.";
            }
        })
        .catch(err => {
            console.error("Phone Validation Error:", err);
            error.textContent = "An error occurred. Please try again.";
        });
}


function proceedToPayment() {
    localStorage.setItem("selectedPlan", JSON.stringify(plans.find(p => p.planId === selectedPlanId)));
    window.location.href = "recharge_preview.html";
}

function showPhoneModal(context) {
    const modal = new bootstrap.Modal("#phoneModal");
    if (context === "change") {
        document.getElementById("phoneInput").value = localStorage.getItem("phoneNumber") || "";
    }
    modal.show();
}

document.addEventListener("DOMContentLoaded", () => {
    const loggedin = localStorage.getItem("loggedin") === "true";
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutSection = document.getElementById("logout");

    if (logoutBtn && logoutSection) {
        logoutSection.style.display = loggedin ? "block" : "none";
        logoutBtn.style.display = loggedin ? "none" : "block";
    }
});

document.getElementById("logout")?.addEventListener("click", () => {
    localStorage.removeItem("loggedin");
    window.location.reload();
});