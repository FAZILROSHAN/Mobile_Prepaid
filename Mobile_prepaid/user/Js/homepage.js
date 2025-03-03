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
            phoneError.textContent = "Invalid Number";
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
        
        if (!/^[6-9]\d{9}$/.test(number)) {
            phoneError.textContent = "Enter a valid 10-digit phone number!";
        } else {
            phoneError.textContent = "";
            rechargeButton.classList.add("loading");
            rechargeButton.disabled = true;
            setTimeout(() => {
                localStorage.setItem("phoneNumber", number);
                localStorage.setItem("cameFromrecharge", "true");
                window.location.href = "plans.html";
            }, 1000);
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

        // Timeline animation
        const timeline = document.querySelector(".timeline");
        const stages = document.querySelectorAll(".stage");
        const timelineTop = timeline.getBoundingClientRect().top + window.scrollY;
        const timelineHeight = timeline.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;

        if (scrollPosition > timelineTop) {
            const progress = Math.min((scrollPosition - timelineTop) / timelineHeight, 1);
            timeline.style.setProperty("--line-height", `${progress * 100}%`);
        } else {
            timeline.style.setProperty("--line-height", "0%");
        }

        stages.forEach(stage => {
            let stageTop = stage.getBoundingClientRect().top;
            if (stageTop < window.innerHeight * 0.8) {
                stage.classList.add("show");
                stage.classList.remove("hide");
            } else if (stageTop > window.innerHeight) {
                stage.classList.add("hide");
                stage.classList.remove("show");
            }
        });
    });
    
    backToTopButton.addEventListener("click", function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Clear stored data when user comes back to home page
    localStorage.removeItem("phoneNumber");
});