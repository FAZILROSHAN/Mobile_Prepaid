package com.example.mobi.service.impl;

import com.example.mobi.model.KYCDetails;
import com.example.mobi.repository.KycDetailsRepository;
import com.example.mobi.service.KycDetailsService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class KycDetailsServiceImpl implements KycDetailsService {

    private final KycDetailsRepository kycDetailsRepository;

    public KycDetailsServiceImpl(KycDetailsRepository kycDetailsRepository) {
        this.kycDetailsRepository = kycDetailsRepository;
    }

    @Override
    public List<KYCDetails> getAllKycDetails() {
        return kycDetailsRepository.findAll();
    }

    @Override
    public Optional<KYCDetails> getKycById(Integer id) {
        return kycDetailsRepository.findById(id);
    }

    @Override
    public KYCDetails createKyc(KYCDetails kycDetails) {
        return kycDetailsRepository.save(kycDetails);
    }
}
