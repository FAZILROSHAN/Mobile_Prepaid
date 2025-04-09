package com.example.mobi.service;

import com.example.mobi.model.AdminNotifications;
import java.util.List;
import java.util.Optional;

public interface AdminNotificationService {
    List<AdminNotifications> getAllNotifications();
    Optional<AdminNotifications> getNotificationById(Integer id);
    AdminNotifications createNotification(AdminNotifications notification);
}
