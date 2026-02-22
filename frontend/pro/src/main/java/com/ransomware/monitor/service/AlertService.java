package com.ransomware.monitor.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.ransomware.monitor.entity.*;
import com.ransomware.monitor.repository.AlertRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    public void createAlert(Severity severity, String process, Integer pid, String reason) {

        Alert alert = new Alert();
        alert.setSeverity(severity);
        alert.setProcessName(process);
        alert.setPid(pid);
        alert.setTriggerReason(reason);
        alert.setActionTaken("Process Flagged");
        alert.setResolved(false);
        alert.setTimestamp(LocalDateTime.now());

        alertRepository.save(alert);
    }
}