package com.example.mobi.service.impl;

import com.example.mobi.model.Payments;
import com.example.mobi.repository.PaymentsRepository;
import com.example.mobi.service.PaymentsService;
import com.example.mobi.service.MailSenderService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentsServiceImp implements PaymentsService {

    private final PaymentsRepository paymentsRepository;
    private final MailSenderService mailSenderService;

    public PaymentsServiceImp(PaymentsRepository paymentsRepository, MailSenderService mailSenderService) {
        this.paymentsRepository = paymentsRepository;
        this.mailSenderService = mailSenderService;
    }

    @Override
    public List<Payments> getAllPayments() {
        return paymentsRepository.findAll();
    }

    @Override
    public Optional<Payments> getPaymentById(Integer id) {
        return paymentsRepository.findById(id);
    }

    @Override
    public Payments createPayment(Payments payment) {
        Payments savedPayment = paymentsRepository.save(payment);

        // Reload payment to ensure the user entity is fetched
        savedPayment = paymentsRepository.findById(savedPayment.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found after saving!"));

        if (savedPayment.getUser() == null) {
            System.out.println("User not found in payment, skipping email notification.");
            return savedPayment;
        }
        
        String toEmail = savedPayment.getUser().getEmail();
        if (toEmail == null || toEmail.isEmpty()) {
        	System.out.println(toEmail + "  kmlkm " + savedPayment.getUser().getEmail());
            System.out.println("User email not found, skipping email notification.");
            return savedPayment;
        }

        String subject = "Recharge Confirmation";
        String body = "Dear " + savedPayment.getUser().getUsername() + ",\n\n"
                + "Your recharge of ₹" + savedPayment.getAmount() + " was successful.\n"
                + "Transaction ID: " + savedPayment.getReferenceId() + "\n\n"
                + "Thank you for using Mobi Comm.";

        // Send the email
        mailSenderService.sendEmail(toEmail, subject, body);

        return savedPayment;
    }
}
