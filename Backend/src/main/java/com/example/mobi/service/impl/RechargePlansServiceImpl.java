package com.example.mobi.service.impl;

import com.example.mobi.model.RechargePlans;
import com.example.mobi.repository.RechargePlansRepository;
import com.example.mobi.service.RechargePlansService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class RechargePlansServiceImpl implements RechargePlansService {

    private final RechargePlansRepository rechargePlansRepository;

    public RechargePlansServiceImpl(RechargePlansRepository rechargePlansRepository) {
        this.rechargePlansRepository = rechargePlansRepository;
    }

    @Override
    public List<RechargePlans> getAllPlans() {
        return rechargePlansRepository.findAll();
    }

    @Override
    public Optional<RechargePlans> getPlanById(Integer id) {
        return rechargePlansRepository.findById(id);
    }

    @Override
    public RechargePlans createPlan(RechargePlans plan) {
        return rechargePlansRepository.save(plan);
    }

    @Override
    public List<RechargePlans> createPlansBulk(List<RechargePlans> plans) {
        return rechargePlansRepository.saveAll(plans);
    }

    @Override
    public RechargePlans updatePlan(Integer id, RechargePlans updatedPlan) {
        return rechargePlansRepository.findById(id)
                .map(plan -> {
                    plan.setPlanName(updatedPlan.getPlanName());
                    plan.setPrice(updatedPlan.getPrice());
                    plan.setValidityDays(updatedPlan.getValidityDays());
                    plan.setData(updatedPlan.getData());
                    plan.setBenefits(updatedPlan.getBenefits());
                    plan.setIsActive(updatedPlan.getIsActive());
                    plan.setCategory(updatedPlan.getCategory());
                    return rechargePlansRepository.save(plan);
                }).orElseThrow(() -> new EntityNotFoundException("Plan with ID " + id + " not found"));
    }

    @Override
    public boolean deletePlan(Integer id) {
        if (!rechargePlansRepository.existsById(id)) {
            return false;
        }
        rechargePlansRepository.deleteById(id);
        return true;
    }

    @Override
    public List<RechargePlans> searchPlans(BigDecimal price, String data, String benefits) {
        if (price != null) {
            return rechargePlansRepository.findByPrice(price);
        } else if (data != null) {
            return rechargePlansRepository.findByDataContainingIgnoreCase(data);
        } else if (benefits != null) {
            return rechargePlansRepository.findByBenefitsContainingIgnoreCase(benefits);
        }
        return rechargePlansRepository.findAll();
    }

    @Override
    public List<RechargePlans> filterPlans(BigDecimal min, BigDecimal max, Integer days, Integer categoryId) {
        if (min != null && max != null) {
            return rechargePlansRepository.findByPriceBetween(min, max);
        } else if (days != null) {
            return rechargePlansRepository.findByValidityDays(days);
        } else if (categoryId != null) {
            return rechargePlansRepository.findByCategoryCategoryId(categoryId);
        }
        return rechargePlansRepository.findAll();
    }
}
