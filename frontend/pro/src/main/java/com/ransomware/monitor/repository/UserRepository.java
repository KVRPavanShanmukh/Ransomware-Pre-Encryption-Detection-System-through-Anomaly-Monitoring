package com.ransomware.monitor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ransomware.monitor.entity.*;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
}