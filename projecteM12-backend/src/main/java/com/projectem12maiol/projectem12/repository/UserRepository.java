package com.projectem12maiol.projectem12.repository;

import com.projectem12maiol.projectem12.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByUsernameOrEmail(String username, String email);

    User findByEmailAndIdNot(String email, Long id);

    User findByUsernameAndIdNot(String username, Long id);

    List<User> findByUsernameNot(String username);

    Optional<User> findByIdAndUsername(Long id, String username);

    List<User> findByUsernameContainingOrEmailContainingAndUsernameNot(String searchQuery, String searchQuery2, String usernameToExclude);

    List<User> findByUsernameContainingOrEmailContaining(String username, String email);


}
