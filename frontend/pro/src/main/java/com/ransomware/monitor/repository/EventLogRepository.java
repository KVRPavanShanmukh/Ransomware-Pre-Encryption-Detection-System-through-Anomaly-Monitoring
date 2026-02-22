package com.ransomware.monitor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ransomware.monitor.entity.EventLog;

public interface EventLogRepository extends JpaRepository<EventLog, Integer> {
}