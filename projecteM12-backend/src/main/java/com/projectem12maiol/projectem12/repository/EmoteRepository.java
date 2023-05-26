package com.projectem12maiol.projectem12.repository;

import com.projectem12maiol.projectem12.model.Emote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmoteRepository extends JpaRepository<Emote, Long> {

}
