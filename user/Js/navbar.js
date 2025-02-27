document.addEventListener("DOMContentLoaded", function () {
    // Get navbar elements
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    // Add smooth scroll effect if navbar exists
    if (navbar) {
        window.addEventListener("scroll", function () {
            navbar.classList.toggle("scrolled", window.scrollY > 5);
        });
    }

    // Add mobile menu toggle if elements exist
    document.addEventListener("DOMContentLoaded", function () {
        const menuToggle = document.querySelector(".menu-toggle");
        const navLinks = document.querySelector(".nav-links");
    
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
    
        // Add active class to the current page link
        const links = document.querySelectorAll(".nav-links a");
        const currentPath = window.location.pathname.split("/").pop(); // Get current file name
    
        links.forEach(link => {
            const linkPath = link.getAttribute("href").split("/").pop(); // Get href file name
    
            if (linkPath === currentPath || (currentPath === "" && linkPath === "homepage.html")) {
                link.classList.add("active");
            } else {
                link.classList.remove("active"); // Ensure other links don’t stay active
            }
        });
    });
    
});