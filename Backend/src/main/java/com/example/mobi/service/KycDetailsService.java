package com.example.mobi.service;

import com.example.mobi.model.KYCDetails;
import java.util.List;
import java.util.Optional;

public interface KycDetailsService {
    List<KYCDetails> getAllKycDetails();
    Optional<KYCDetails> getKycById(Integer id);
    KYCDetails createKyc(KYCDetails kycDetails);
}
