package com.example.mobi.controller;

import com.example.mobi.model.Payments;
import com.example.mobi.service.PaymentsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/payments")
public class PaymentsController {

    private final PaymentsService paymentsService;

    public PaymentsController(PaymentsService paymentsService) {
        this.paymentsService = paymentsService;
    }

    @GetMapping
    public List<Payments> getAllPayments() {
        return paymentsService.getAllPayments();
    }

    @GetMapping("/{id}")
    public Optional<Payments> getPaymentById(@PathVariable Integer id) {
        return paymentsService.getPaymentById(id);
    }

    @PostMapping
    public Payments createPayment(@RequestBody Payments payment) {
        return paymentsService.createPayment(payment);
    }
}
