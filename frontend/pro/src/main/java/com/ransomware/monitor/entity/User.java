package com.ransomware.monitor.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String username;

    @Column(name = "password_hash")
    private String passwordHash;

    private String email;

    @Column(name = "sec_q")
    private String secQ;

    @Column(name = "sec_a_hash")
    private String secAHash;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}