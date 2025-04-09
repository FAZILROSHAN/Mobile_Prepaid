package com.example.mobi.repository;

import com.example.mobi.model.UserPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserPlanRepository extends JpaRepository<UserPlan, Integer> {
    List<UserPlan> findByUserUserIdOrderByActivatedAtDesc(Integer userId);
}
