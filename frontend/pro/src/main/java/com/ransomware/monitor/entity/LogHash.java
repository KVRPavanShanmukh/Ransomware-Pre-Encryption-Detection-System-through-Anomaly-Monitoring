package com.ransomware.monitor.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "log_hashes")
public class LogHash {

    @Id
    @Column(name = "log_id")
    private Integer logId;

    @Column(name = "hash_value")
    private String hashValue;
}