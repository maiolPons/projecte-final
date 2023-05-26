package com.projectem12maiol.projectem12.repository;

import com.projectem12maiol.projectem12.model.Message;
import com.projectem12maiol.projectem12.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndRecipient(User sender, User recipient);


}

