package com.ransomware.monitor.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.ransomware.monitor.entity.*;
import com.ransomware.monitor.repository.ProcessWhitelistRepository;

@Service
@RequiredArgsConstructor
public class AnomalyDetectionService {

    private final AlertService alertService;
    private final ProcessWhitelistRepository whitelistRepository;

    public void analyze(EventLog log) {

        if (whitelistRepository.findByProcessName(log.getProcessName()).isPresent()) {
            return;
        }

        if (log.getEntropy() != null && log.getEntropy() > 7.5 &&
            "Write".equalsIgnoreCase(log.getAccessType())) {

            alertService.createAlert(
                    Severity.HIGH,
                    log.getProcessName(),
                    log.getPid(),
                    "High entropy file write detected"
            );
        }
    }
}