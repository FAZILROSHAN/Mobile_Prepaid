package com.example.mobi.repository;

import com.example.mobi.model.AdminNotifications;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdminNotificationsRepository extends JpaRepository<AdminNotifications, Integer> {
	List<AdminNotifications> findByUser_UserId(Integer userId);
}
