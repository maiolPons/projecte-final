package com.projectem12maiol.projectem12.repository;

import com.projectem12maiol.projectem12.model.Raid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RaidRepository extends JpaRepository<Raid, Long> {
    List<Raid> findByStatusTrue();
}
