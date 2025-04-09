package com.example.mobi.repository;

import com.example.mobi.model.RechargePlans;
import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigDecimal;
import java.util.List;

public interface RechargePlansRepository extends JpaRepository<RechargePlans, Integer> {
    List<RechargePlans> findByIsActiveTrue();

    // Search Queries
    List<RechargePlans> findByPrice(BigDecimal price);
    List<RechargePlans> findByDataContainingIgnoreCase(String data);
    List<RechargePlans> findByBenefitsContainingIgnoreCase(String benefits);

    // Filter Queries
    List<RechargePlans> findByPriceBetween(BigDecimal min, BigDecimal max);
    List<RechargePlans> findByValidityDays(Integer days);
    List<RechargePlans> findByCategoryCategoryId(Integer categoryId);
}
