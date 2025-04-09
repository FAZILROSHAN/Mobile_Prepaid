package com.example.mobi.repository;

import com.example.mobi.model.UserNotifications;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserNotificationsRepository extends JpaRepository<UserNotifications, Integer> {
    List<UserNotifications> findByUser_UserId(Integer userId);
}
