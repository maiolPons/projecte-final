package com.projectem12maiol.projectem12.repository;

import com.projectem12maiol.projectem12.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRoleAndStatus(String role, boolean status);
}
