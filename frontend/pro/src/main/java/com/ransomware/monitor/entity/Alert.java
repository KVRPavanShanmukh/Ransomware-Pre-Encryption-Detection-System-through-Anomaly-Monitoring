package com.ransomware.monitor.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    @Column(name = "process_name")
    private String processName;

    private Integer pid;

    @Column(name = "trigger_reason")
    private String triggerReason;

    @Column(name = "action_taken")
    private String actionTaken;

    private Boolean resolved;

    private LocalDateTime timestamp;
}