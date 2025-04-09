package com.example.mobi.repository;

import com.example.mobi.model.ContactUs;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactUsRepository extends JpaRepository<ContactUs, Integer> {
	List<ContactUs> findByUser_UserId(Integer userId);
}
