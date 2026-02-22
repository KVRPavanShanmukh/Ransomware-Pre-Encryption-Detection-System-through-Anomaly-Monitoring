package com.ransomware.monitor.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "process_whitelist")
public class ProcessWhitelist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "process_name", unique = true)
    private String processName;

    private String description;

    @Column(name = "added_by")
    private String addedBy;
}