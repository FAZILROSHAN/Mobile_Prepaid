package com.example.mobi.service;

import com.example.mobi.model.UserPlan;
import com.example.mobi.model.Users;
import com.example.mobi.model.RechargePlans;
import java.util.List;

public interface UserPlanService {
    List<UserPlan> getUserPlans(Integer userId);
    void activatePlan(Users user, RechargePlans plan);
}
