package com.projectem12maiol.projectem12.repository;

import com.projectem12maiol.projectem12.model.Member;
import com.projectem12maiol.projectem12.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findByUser(User user);
}

