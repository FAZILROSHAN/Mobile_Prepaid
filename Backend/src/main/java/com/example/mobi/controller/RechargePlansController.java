package com.example.mobi.controller;

import com.example.mobi.model.RechargePlans;
import com.example.mobi.service.RechargePlansService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/recharge-plans")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class RechargePlansController {

    private final RechargePlansService rechargePlansService;

    public RechargePlansController(RechargePlansService rechargePlansService) {
        this.rechargePlansService = rechargePlansService;
    }

    @GetMapping
    public ResponseEntity<List<RechargePlans>> getAllPlans() {
        List<RechargePlans> plans = rechargePlansService.getAllPlans();
        return plans.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RechargePlans> getPlanById(@PathVariable Integer id) {
        return rechargePlansService.getPlanById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<RechargePlans> createPlan(@RequestBody RechargePlans plan) {
        RechargePlans savedPlan = rechargePlansService.createPlan(plan);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPlan);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<RechargePlans>> createPlansBulk(@RequestBody List<RechargePlans> plans) {
        List<RechargePlans> savedPlans = rechargePlansService.createPlansBulk(plans);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPlans);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<RechargePlans> updatePlan(@PathVariable Integer id, @RequestBody RechargePlans plan) {
        RechargePlans updatedPlan = rechargePlansService.updatePlan(id, plan);
        return updatedPlan != null ? ResponseEntity.ok(updatedPlan) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Integer id) {
        boolean deleted = rechargePlansService.deletePlan(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // 🔹 Unified Search Endpoint with ResponseEntity
    @GetMapping("/search")
    public ResponseEntity<List<RechargePlans>> searchPlans(
            @RequestParam(value = "price", required = false) BigDecimal price,
            @RequestParam(value = "data", required = false) String data,
            @RequestParam(value = "benefits", required = false) String benefits) {
        List<RechargePlans> results = rechargePlansService.searchPlans(price, data, benefits);
        return results.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(results);
    }

    // 🔹 Unified Filter Endpoint with ResponseEntity
    @GetMapping("/filter")
    public ResponseEntity<List<RechargePlans>> filterPlans(
            @RequestParam(value = "min", required = false) BigDecimal min,
            @RequestParam(value = "max", required = false) BigDecimal max,
            @RequestParam(value = "days", required = false) Integer days,
            @RequestParam(value = "categoryId", required = false) Integer categoryId) {
        List<RechargePlans> results = rechargePlansService.filterPlans(min, max, days, categoryId);
        return results.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(results);
    }
}
