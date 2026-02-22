package com.ransomware.monitor.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ransomware.monitor.entity.EventLog;
import com.ransomware.monitor.service.EventLogService;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final EventLogService eventLogService;

    @PostMapping
    public ResponseEntity<String> receiveLog(@RequestBody EventLog log) throws Exception {
        eventLogService.processLog(log);
        return ResponseEntity.ok("Log processed");
    }
}