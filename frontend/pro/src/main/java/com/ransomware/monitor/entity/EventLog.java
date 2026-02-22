package com.ransomware.monitor.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "event_logs")
public class EventLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "process_name")
    private String processName;

    private Integer pid;

    @Column(name = "target_path")
    private String targetPath;

    @Column(name = "access_type")
    private String accessType;

    private Double entropy;

    private LocalDateTime timestamp;
}