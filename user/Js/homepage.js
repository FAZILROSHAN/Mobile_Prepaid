document.addEventListener("DOMContentLoaded", function () {
    // Handle phone number input
    const phoneInput = document.getElementById("phoneNumber");
    const rechargeButton = document.getElementById("rechargeButton");
    const phoneError = document.getElementById("phoneError");

    phoneInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
        
        // Ensure the first digit is between 6-9
        if (value.length > 0 && !/^[6-9]/.test(value.charAt(0))) {
            value = "";
            phoneError.textContent = "Number must start with 6, 7, 8, or 9";
        } else {
            phoneError.textContent = "";
        }
        
        if (value.length > 10) value = value.slice(0, 10); // Ensure only 10 digits
        
        e.target.value = value;
        rechargeButton.disabled = value.length !== 10;
    });

    // Quick Recharge function
    window.quickRecharge = function() {
        let number = phoneInput.value.trim();
        
        // Check if number is valid
        if (!/^[6-9]\d{9}$/.test(number)) {
            phoneError.textContent = "Enter a valid 10-digit phone number!";
        } else {
            phoneError.textContent = "";
            localStorage.setItem("phoneNumber", number);
            localStorage.setItem("cameFromrecharge", "true");
            
            // Redirect to Plans page
            window.location.href = "plans.html";
        }
    };

    // Set up the recharge button click handler
    rechargeButton.addEventListener("click", quickRecharge);

    // Back to Top button functionality
    const backToTopButton = document.getElementById("backToTop");
    
    window.addEventListener("scroll", function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add("visible");
        } else {
            backToTopButton.classList.remove("visible");
        }
    });
    
    backToTopButton.addEventListener("click", function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Clear stored data when user comes back to home page
    localStorage.clear();
});