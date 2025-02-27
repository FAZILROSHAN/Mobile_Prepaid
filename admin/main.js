document.addEventListener('DOMContentLoaded', function() {
    // Load sidebar and dashboard on first load
    loadSidebar();
    loadDashboard();

    // Tab switching functionality
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all tabs and content
            document.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Load content based on the selected tab
            const tabName = this.getAttribute('data-tab');
            document.getElementById(`${tabName}Content`).classList.add('active');

            // Dynamically load content
            loadTabContent(tabName);
        });
    });
});

// Function to populate the sidebar
function loadSidebar() {
    document.getElementById('sidebar').innerHTML = `
        <div class="p-3">
            <h4 class="text-center mb-4">MobiCharge Admin</h4>
            <div class="text-center mb-4">
                <img src="/api/placeholder/80/80" class="rounded-circle mb-3" alt="Admin">
                <h6>Admin Panel</h6>
                <small>Welcome, Admin</small>
            </div>
            <hr>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <a class="nav-link active" href="#" data-tab="dashboard"><i class="fas fa-tachometer-alt me-2"></i> Dashboard</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-tab="plans"><i class="fas fa-mobile-alt me-2"></i> Plans & Packages</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-tab="analytics"><i class="fas fa-chart-bar me-2"></i> Analytics</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-tab="tickets"><i class="fas fa-ticket-alt me-2"></i> Support Tickets</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-tab="settings"><i class="fas fa-cog me-2"></i> Settings</a>
                </li>
            </ul>
        </div>
    `;
}

// Function to load tab content
function loadTabContent(tabName) {
    switch (tabName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'plans':
            loadPlans();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'tickets':
            loadTickets();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// Functions to populate each tab
function loadDashboard() {
    document.getElementById('dashboardContent').innerHTML = `
        <h2>Dashboard</h2>
        <p>Welcome to the MobiCharge admin dashboard.</p>
        <div class="row">
            <div class="col-md-4">
                <div class="card stat-card">
                    <div class="card-body">
                        <h5>Total Users</h5>
                        <h3>15,847</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card stat-card">
                    <div class="card-body">
                        <h5>Active Users</h5>
                        <h3>12,583</h3>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadPlans() {
    document.getElementById('plansContent').innerHTML = `
        <h2>Plans & Packages</h2>
        <p>Manage the mobile plans available for customers.</p>
    `;
}

function loadAnalytics() {
    document.getElementById('analyticsContent').innerHTML = `
        <h2>Analytics</h2>
        <canvas id="userGrowthChart"></canvas>
        <canvas id="revenueChart"></canvas>
    `;
    initializeCharts(); // Call chart initialization function
}

function loadTickets() {
    document.getElementById('ticketsContent').innerHTML = `
        <h2>Support Tickets</h2>
        <p>View and manage customer support tickets.</p>
    `;
}

function loadSettings() {
    document.getElementById('settingsContent').innerHTML = `
        <h2>Settings</h2>
        <p>Configure the MobiCharge admin settings.</p>
    `;
}
