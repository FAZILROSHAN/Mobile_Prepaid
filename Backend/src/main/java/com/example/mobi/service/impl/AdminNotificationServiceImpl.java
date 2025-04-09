package com.example.mobi.service.impl;

import com.example.mobi.model.AdminNotifications;
import com.example.mobi.repository.AdminNotificationsRepository;
import com.example.mobi.service.AdminNotificationService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AdminNotificationServiceImpl implements AdminNotificationService {

    private final AdminNotificationsRepository adminNotificationRepository;

    public AdminNotificationServiceImpl(AdminNotificationsRepository adminNotificationRepository) {
        this.adminNotificationRepository = adminNotificationRepository;
    }

    @Override
    public List<AdminNotifications> getAllNotifications() {
        return adminNotificationRepository.findAll();
    }

    @Override
    public Optional<AdminNotifications> getNotificationById(Integer id) {
        return adminNotificationRepository.findById(id);
    }

    @Override
    public AdminNotifications createNotification(AdminNotifications notification) {
        return adminNotificationRepository.save(notification);
    }
}
