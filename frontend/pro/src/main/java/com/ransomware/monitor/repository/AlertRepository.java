package com.ransomware.monitor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ransomware.monitor.entity.Alert;

public interface AlertRepository extends JpaRepository<Alert, Integer> {
}