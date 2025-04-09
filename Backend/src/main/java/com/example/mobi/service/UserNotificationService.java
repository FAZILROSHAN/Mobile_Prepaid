package com.example.mobi.service;

import com.example.mobi.model.UserNotifications;
import java.util.List;
import java.util.Optional;

public interface UserNotificationService {
    List<UserNotifications> getAllUserNotifications();
    Optional<UserNotifications> getUserNotificationById(Integer id);
    UserNotifications createUserNotification(UserNotifications notification);
}
