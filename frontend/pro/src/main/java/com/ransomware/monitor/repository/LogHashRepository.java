package com.ransomware.monitor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ransomware.monitor.entity.LogHash;

public interface LogHashRepository extends JpaRepository<LogHash, Integer> {
}