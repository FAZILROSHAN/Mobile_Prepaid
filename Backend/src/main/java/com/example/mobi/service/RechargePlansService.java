package com.example.mobi.service;

import com.example.mobi.model.RechargePlans;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface RechargePlansService {
    List<RechargePlans> getAllPlans();
    Optional<RechargePlans> getPlanById(Integer id);
    RechargePlans createPlan(RechargePlans plan);
    List<RechargePlans> createPlansBulk(List<RechargePlans> plans);
    RechargePlans updatePlan(Integer id, RechargePlans plan);
    boolean deletePlan(Integer id);

    // Search methods
    List<RechargePlans> searchPlans(BigDecimal price, String data, String benefits);

    // Filter methods
    List<RechargePlans> filterPlans(BigDecimal min, BigDecimal max, Integer days, Integer categoryId);
}
