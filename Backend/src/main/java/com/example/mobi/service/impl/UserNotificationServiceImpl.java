package com.example.mobi.service.impl;

import com.example.mobi.model.UserNotifications;
import com.example.mobi.repository.UserNotificationsRepository;
import com.example.mobi.service.UserNotificationService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserNotificationServiceImpl implements UserNotificationService {

    private final UserNotificationsRepository userNotificationRepository;

    public UserNotificationServiceImpl(UserNotificationsRepository userNotificationRepository) {
        this.userNotificationRepository = userNotificationRepository;
    }

    @Override
    public List<UserNotifications> getAllUserNotifications() {
        return userNotificationRepository.findAll();
    }

    @Override
    public Optional<UserNotifications> getUserNotificationById(Integer id) {
        return userNotificationRepository.findById(id);
    }

    @Override
    public UserNotifications createUserNotification(UserNotifications notification) {
        return userNotificationRepository.save(notification);
    }
}
