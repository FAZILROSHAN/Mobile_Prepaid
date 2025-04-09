package com.example.mobi.service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.Random;
import java.time.Instant;

@Service
public class OtpService {
    private static final int OTP_EXPIRY_SECONDS = 300;
    private final Map<String, OtpEntry> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String generateOtp(String phoneNumber) {
        String formattedPhone = formatPhoneNumber(phoneNumber);
        String otp = String.format("%06d", random.nextInt(1000000));
        otpStorage.put(formattedPhone, new OtpEntry(otp, Instant.now().plusSeconds(OTP_EXPIRY_SECONDS)));
        return otp;
    }

    public boolean validateOtp(String phoneNumber, String otp) {
        String formattedPhone = formatPhoneNumber(phoneNumber);
        OtpEntry entry = otpStorage.get(formattedPhone);
        if (entry == null || Instant.now().isAfter(entry.expiryTime)) {
            otpStorage.remove(formattedPhone);
            return false;
        }
        boolean isValid = entry.otp.equals(otp);
        if (isValid) {
            otpStorage.remove(formattedPhone);
        }
        return isValid;
    }

    @Scheduled(fixedRate = 60000)
    public void removeExpiredOtps() {
        otpStorage.entrySet().removeIf(entry -> Instant.now().isAfter(entry.getValue().expiryTime));
    }

    public String formatPhoneNumber(String phoneNumber) {
        if (!phoneNumber.startsWith("+")) {
            return "+91" + phoneNumber;
        }
        return phoneNumber;
    }

    private static class OtpEntry {
        String otp;
        Instant expiryTime;

        OtpEntry(String otp, Instant expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}
