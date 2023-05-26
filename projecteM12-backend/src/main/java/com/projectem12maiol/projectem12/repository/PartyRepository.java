package com.projectem12maiol.projectem12.repository;

import com.projectem12maiol.projectem12.model.Member;
import com.projectem12maiol.projectem12.model.Party;
import com.projectem12maiol.projectem12.model.Raid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartyRepository extends JpaRepository<Party, Long> {
    List<Party> findByRaid(Raid raid);
    List<Party> findByMember1OrMember2OrMember3OrMember4OrMember5OrMember6OrMember7OrMember8(
            Member member1, Member member2, Member member3, Member member4,
            Member member5, Member member6, Member member7, Member member8);
}

