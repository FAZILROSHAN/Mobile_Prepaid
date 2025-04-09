package com.example.mobi.service.impl;

import com.example.mobi.model.UserPlan;
import com.example.mobi.model.Users;
import com.example.mobi.model.RechargePlans;
import com.example.mobi.repository.UserPlanRepository;
import com.example.mobi.service.UserPlanService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserPlanServiceImpl implements UserPlanService {

    private final UserPlanRepository userPlanRepository;

    public UserPlanServiceImpl(UserPlanRepository userPlanRepository) {
        this.userPlanRepository = userPlanRepository;
    }

    @Override
    public List<UserPlan> getUserPlans(Integer userId) {
        return userPlanRepository.findByUserUserIdOrderByActivatedAtDesc(userId);
    }

    @Override
    public void activatePlan(Users user, RechargePlans plan) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusDays(plan.getValidityDays());

        UserPlan userPlan = new UserPlan();
        userPlan.setUser(user);
        userPlan.setPlan(plan);
        userPlan.setActivatedAt(now);
        userPlan.setExpiresAt(expiresAt);
        userPlan.setStatus(UserPlan.Status.ACTIVE);

        userPlanRepository.save(userPlan);
    }
}
