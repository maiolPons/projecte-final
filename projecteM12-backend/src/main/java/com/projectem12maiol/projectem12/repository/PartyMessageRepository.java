package com.projectem12maiol.projectem12.repository;

import com.projectem12maiol.projectem12.model.Party;
import com.projectem12maiol.projectem12.model.PartyMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartyMessageRepository  extends JpaRepository<PartyMessage, Long> {
    List<PartyMessage> findByParty(Party party);
    List<PartyMessage> findByPartyId(Long partyId);
}
