package com.example.mobi.controller;

import com.example.mobi.model.UserPlan;
import com.example.mobi.service.UserPlanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-plans")
public class UserPlanController {

    private final UserPlanService userPlanService;

    public UserPlanController(UserPlanService userPlanService) {
        this.userPlanService = userPlanService;
    }

    @GetMapping("/{userId}")
    public List<UserPlan> getUserPlans(@PathVariable Integer userId) {
        return userPlanService.getUserPlans(userId);
    }
}
