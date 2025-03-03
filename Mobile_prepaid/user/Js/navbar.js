document.addEventListener("DOMContentLoaded", function () {
    // Get navbar elements
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const authLink = document.querySelector("#authLink");
    const userDropdown = document.querySelector("#userDropdown");

    // Add smooth scroll effect
    if (navbar) {
        window.addEventListener("scroll", function () {
            navbar.classList.toggle("scrolled", window.scrollY > 5);
        });
    }

    // Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });

        // Close menu when clicking outside
        document.addEventListener("click", function (e) {
            if (!e.target.closest(".navbar") && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
        });
    }

    // Add active class to current page link
    const links = document.querySelectorAll(".nav-links a");
    if (links.length > 0) {
        const currentPath = window.location.pathname.split("/").pop();
        links.forEach(link => {
            const linkPath = link.getAttribute("href").split("/").pop();
            if (linkPath === currentPath || (currentPath === "" && linkPath === "homepage.html")) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    // Dropdown toggle for auth link (e.g., Sign Up/Login)
    if (authLink && userDropdown) {
        authLink.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent default anchor behavior
            userDropdown.classList.toggle("active");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", function (e) {
            if (!e.target.closest(".nav-item") && userDropdown.classList.contains("active")) {
                userDropdown.classList.remove("active");
            }
        });
    }

    // Example: Update dropdown based on user login state (customize as needed)
    const userNumber = "123-456-7890"; // Replace with real user data check
    if (userNumber && userDropdown) {
        document.querySelector("#userNumber").textContent = userNumber;
        document.querySelector("#profile").style.display = "block";
        document.querySelector("#logout").style.display = "block";
        document.querySelector("#logoutBtn").style.display = "none";
    }
});