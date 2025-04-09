document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const authLink = document.querySelector("#authLink");
    const userDropdown = document.querySelector("#userDropdown");
    const userNameDisplay = document.querySelector("#userName");
    const loginBtn = document.querySelector("#logoutBtn"); // This is actually your Login
    const profileBtn = document.querySelector("#profile");
    const logoutBtn = document.querySelector("#logout");

    if (navbar) {
        window.addEventListener("scroll", function () {
            navbar.classList.toggle("scrolled", window.scrollY > 5);
        });
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });

        document.addEventListener("click", function (e) {
            if (!e.target.closest(".navbar") && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
        });
    }

    const links = document.querySelectorAll(".nav-links a");
    const currentPath = window.location.pathname.split("/").pop();
    links.forEach(link => {
        const linkPath = link.getAttribute("href").split("/").pop();
        if (linkPath === currentPath || (currentPath === "" && linkPath === "homepage.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    if (authLink && userDropdown) {
        authLink.addEventListener("click", function (e) {
            e.preventDefault();
            userDropdown.classList.toggle("active");
        });

        document.addEventListener("click", function (e) {
            if (!e.target.closest(".nav-item") && userDropdown.classList.contains("active")) {
                userDropdown.classList.remove("active");
            }
        });
    }

    const loggedIn = sessionStorage.getItem("loggedin") === "true";
    const username = sessionStorage.getItem("username");

    if (loggedIn && username) {
        authLink.textContent = "My Account";
        if (userNameDisplay) userNameDisplay.textContent = `Welcome, ${username}`;
        if (loginBtn) loginBtn.style.display = "none";
        if (profileBtn) profileBtn.style.display = "inline-block";
        if (logoutBtn) {
            logoutBtn.style.display = "inline-block";
            logoutBtn.addEventListener("click", () => {
                sessionStorage.clear();
                window.location.href = "homepage.html";
            });
        }
    } else {
        authLink.textContent = "Sign Up";
        if (userNameDisplay) userNameDisplay.textContent = "";
        if (loginBtn) loginBtn.style.display = "block";
        if (profileBtn) profileBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
});
