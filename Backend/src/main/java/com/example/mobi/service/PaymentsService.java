package com.example.mobi.service;

import com.example.mobi.model.Payments;
import java.util.List;
import java.util.Optional;

public interface PaymentsService {
    List<Payments> getAllPayments();
    Optional<Payments> getPaymentById(Integer id);
    Payments createPayment(Payments payment);
}
