package com.example.mobi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String toEmail, String subject, String body) {
        try {
        	MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom("2k21cse027@kiot.ac.in"); 
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body,true);

            mailSender.send(message);
            System.out.println("Email Sent Successfully!");
        }catch(MessagingException e){
        	System.err.println("can't able to send");
        }
        }
}