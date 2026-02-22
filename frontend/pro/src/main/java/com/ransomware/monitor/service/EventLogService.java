package com.ransomware.monitor.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.ransomware.monitor.entity.*;
import com.ransomware.monitor.repository.*;
import com.ransomware.monitor.util.HashUtil;

@Service
@RequiredArgsConstructor
public class EventLogService {

    private final EventLogRepository eventLogRepository;
    private final LogHashRepository logHashRepository;
    private final AnomalyDetectionService anomalyService;

    public void processLog(EventLog log) throws Exception {

        EventLog saved = eventLogRepository.save(log);

        String hashInput = saved.getEventId() + saved.getProcessName() +
                saved.getTargetPath() + saved.getTimestamp();

        String hash = HashUtil.sha256(hashInput);

        LogHash logHash = new LogHash();
        logHash.setLogId(saved.getId());
        logHash.setHashValue(hash);

        logHashRepository.save(logHash);

        anomalyService.analyze(saved);
    }
}