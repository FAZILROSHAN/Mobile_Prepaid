const sendOtpButton = document.getElementById('sendOtpButton');
const verifyOtpButton = document.getElementById('verifyOtpButton');
const mobileNumberInput = document.getElementById('mobileNumber');
const otpPopup = document.getElementById('otpPopup');
const errorMessage = document.getElementById('errorMessage');
const API_URL = 'http://localhost:8083/auth/send-otp';

sendOtpButton.addEventListener('click', async () => {
    let phoneNumber = mobileNumberInput.value.trim();
    
    if (phoneNumber.startsWith("+91")) {
        phoneNumber = phoneNumber.slice(3); 
    }

    if (phoneNumber.length !== 10) {
        showError('Please enter a valid 10-digit mobile number.');
        return;
    }

    hideError();
    
    try {
        const response = await axios.post(API_URL, { phoneNumber });
        console.log("Backend Response:", response.data); 

        if (response.data.message === 'OTP sent successfully') {
            showSuccess('OTP sent successfully!');
            setTimeout(hideError, 3000);
            showOtpPopup();
        } else {
            showError(response.data.message || 'User is not registered.');
        }
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        showError(error.response?.data?.error || 'User needs to register before OTP can be sent.');
    }
});

verifyOtpButton.addEventListener('click', verifyOtpAndLogin);

function verifyOtpAndLogin() {
    const enteredOTP = getEnteredOTP();
    let phoneNumber = mobileNumberInput.value.trim();
    
    if (phoneNumber.startsWith("+91")) {
        phoneNumber = phoneNumber.slice(3); 
    }

    hideError();

    axios.post('http://localhost:8083/auth/login', { phoneNumber, otp: enteredOTP })
        .then(response => {
            console.log("Login Response:", response.data);

            localStorage.setItem('userPhone', phoneNumber);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('loggedin', 'true');

            showSuccess('Login successful!');
            setTimeout(() => window.location.href = 'user_dashboard.html', 1500);
        })
        .catch(error => {
            console.error("Login Error:", error.response?.data || error.message);
            showError(error.response?.data?.error || 'Invalid OTP or login failed.');
            closeOtpPopup();
        });
}

function getEnteredOTP() {
    let otp = "";
    for (let i = 1; i <= 6; i++) {
        otp += document.getElementById(`otp${i}`).value.trim();
    }
    return otp;
}

function showOtpPopup() {
    otpPopup.style.display = 'flex';
    otpPopup.style.visibility = 'visible';
    otpPopup.style.opacity = '1';
    const firstOtpInput = document.getElementById('otp1');
    firstOtpInput.focus();
    setupOtpInputListeners();
}

function closeOtpPopup() {
    otpPopup.style.display = 'none';
    [...Array(6)].forEach((_, i) => document.getElementById(`otp${i + 1}`).value = '');
    mobileNumberInput.value = '';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'block';
}

function showSuccess(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = 'green';
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

function setupOtpInputListeners() {
    const otpInputs = document.querySelectorAll('.otp-input-fields input');
    
    otpInputs.forEach((input, index) => {
        // Handle input and move to next field
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            if (value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });

        // Handle Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyOtpAndLogin();
            }
        });

        // Handle pasting full OTP
        input.addEventListener('paste', (e) => {
            const pastedData = e.clipboardData.getData('text');
            if (pastedData.length === 6) {
                e.preventDefault();
                for (let i = 0; i < 6 && i < pastedData.length; i++) {
                    otpInputs[i].value = pastedData[i];
                }
                otpInputs[otpInputs.length - 1].focus();
            }
        });
    });
}