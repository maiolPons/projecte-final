package com.projectem12maiol.projectem12.repository;

import com.projectem12maiol.projectem12.model.Friend;
import com.projectem12maiol.projectem12.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findBySenderAndReceiver(User sender, User receiver);
    List<Friend> findByReceiverAndPending(User receiver, boolean pending);
    List<Friend> findBySenderOrReceiverAndPending(User sender, User receiver, boolean pending);

}
