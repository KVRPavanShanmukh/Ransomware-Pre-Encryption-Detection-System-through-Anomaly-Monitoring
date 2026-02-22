package com.ransomware.monitor.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ransomware.monitor.entity.ProcessWhitelist;

public interface ProcessWhitelistRepository extends JpaRepository<ProcessWhitelist, Integer> {
    Optional<ProcessWhitelist> findByProcessName(String processName);
}