const sendOtpButton = document.getElementById('sendOtpButton');
const verifyOtpButton = document.getElementById('verifyOtpButton');
const mobileNumberInput = document.getElementById('mobileNumber');
const otpPopup = document.getElementById('otpPopup');
let generatedOTP;

sendOtpButton.addEventListener('click', () => {
    generatedOTP = generateOTP();
    console.log('Generated OTP (for testing):', generatedOTP);
    showOtpPopup(); // Show the popup *first*
    alert(`Your OTP for testing is: ${generatedOTP}`); // Then show the alert
});

verifyOtpButton.addEventListener('click', () => {
    const enteredOTP = getEnteredOTP();
    const userPhone = mobileNumberInput.value;

    if (enteredOTP === generatedOTP) {
        localStorage.setItem('userPhone', userPhone);
        localStorage.setItem("loggedin","true");
        window.location.href = 'user_dashboard.html';
    } else {
        alert(`Incorrect OTP. Please try again.`);
    }

    generatedOTP = "";
    closeOtpPopup();
});

function getEnteredOTP() {
    let otp = "";
    for (let i = 1; i <= 6; i++) {
        const inputField = document.getElementById(`otp${i}`);
        otp += inputField.value;
    }
    return otp;
}

function showOtpPopup() {
    otpPopup.style.display = 'flex'; // Make the popup visible
    focusOnFirstOtpInput();
}

function closeOtpPopup() {
    otpPopup.style.display = 'none';
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`otp${i}`).value = '';
    }
    mobileNumberInput.value = '';
}

const otpFields = document.querySelectorAll('.otp-field');

otpFields.forEach((field, index) => {
    field.addEventListener('input', () => {
        if (field.value.length === 1) {
            if (index < otpFields.length - 1) {
                otpFields[index + 1].focus();
            }
        }
    });

    field.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace') {
            if (field.value.length === 0 && index > 0) {
                otpFields[index - 1].focus();
            }
        }
    });

    field.addEventListener('paste', (event) => {
        let pasteData = event.clipboardData.getData('text');
        pasteData = pasteData.slice(0, otpFields.length - index);

        for (let i = 0; i < pasteData.length; i++) {
            if (index + i < otpFields.length) {
                otpFields[index + i].value = pasteData[i];
                if (index + i < otpFields.length - 1) {
                    otpFields[index + i + 1].focus();
                }
            }
        }
        event.preventDefault();
    });
});

function focusOnFirstOtpInput() {
    document.getElementById('otp1').focus();
}

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}
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