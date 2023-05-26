package com.projectem12maiol.projectem12.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectem12maiol.projectem12.model.Friend;
import com.projectem12maiol.projectem12.model.User;
import com.projectem12maiol.projectem12.repository.FriendRepository;
import com.projectem12maiol.projectem12.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FriendRepository friendRepository;

    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(@RequestParam("user") String userJson, @RequestParam(value = "avatar", required = false) MultipartFile avatarFile) {
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            User user;
            try {
                user = objectMapper.readValue(userJson, User.class);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                String message = "Failed to parse user data";
                return ResponseEntity.badRequest().body(message);
            }

            // Check if username or email already exists
            User existingUser = userRepository.findByUsernameOrEmail(user.getUsername(), user.getEmail());
            if (existingUser != null) {
                String message = "A user with the same username or email already exists";
                return ResponseEntity.badRequest().body(message);
            }

            if (avatarFile != null) {
                String avatarPath = saveAvatarImage(avatarFile);
                user.setAvatarPath(avatarPath);
            }
            user.setPassword(hashPassword(user.getPassword()));
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        }catch (Exception e){
            String message = "An error occurred while adding the user.";
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/count")
    public Long getUserCount() {
        return userRepository.count();
    }
    private String saveAvatarImage(MultipartFile avatarFile) {
        try {
            String originalFileName = StringUtils.cleanPath(avatarFile.getOriginalFilename());
            String fileName = System.currentTimeMillis() + "_" + originalFileName;
            Path uploadPath = Paths.get("../projectem12/public/uploads/"); //path saved images
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            avatarFile.transferTo(filePath);
            return "uploads/"+fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save avatar image: " + e.getMessage());
        }
    }

    @GetMapping("/users")
    List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @GetMapping("/usersList")
    public List<Map<String, Object>> findUsers(@RequestParam(value = "search", required = false) String searchQuery,
                                               @RequestParam(value = "currentUser") String currentUserUsername) {

        User currentUser = userRepository.findByUsername(currentUserUsername);

        List<User> users;
        if (searchQuery == null || searchQuery.isEmpty()) {
            users = userRepository.findByUsernameNot(currentUserUsername);
        } else {
            users = userRepository.findByUsernameContainingOrEmailContainingAndUsernameNot(searchQuery, searchQuery, currentUserUsername);
        }

        List<Map<String, Object>> response = new ArrayList<>();

        for (User user : users) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("avatar", user.getAvatarPath());

            // check if current user has a pending friend request with this user
            List<Friend> friendRequests = friendRepository.findBySenderAndReceiver(currentUser, user);
            if (!friendRequests.isEmpty()) {
                userMap.put("friendRequestPending", true);
            } else {
                userMap.put("friendRequestPending", false);
            }

            response.add(userMap);
        }

        return response;
    }

    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> loginData, HttpSession session) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        User user = userRepository.findByUsername(username);
        if (user != null && verifyPassword(password,user.getPassword())) {
            // password is correct
            // create new session if session is not new

            if (!session.isNew()) {
                session.invalidate();
            }
            session.setAttribute("username", username);
            session.setAttribute("role", user.getRole());

            return user.getRole()+"/"+user.getUsername()+"/"+user.getId();
        } else {
            // password is incorrect or user does not exist
            return "error"+"/"+"error"+"/"+"error";
        }
    }
    private static String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not available.");
        }
    }

    private static boolean verifyPassword(String inputPassword, String hashedPassword) {
        return hashPassword(inputPassword).equals(hashedPassword);
    }
    @PostMapping("/getUserByUsername")
    public ResponseEntity<?> getUserByUsername(@RequestParam("username") String username) {
        try {
            User user = userRepository.findByUsername(username);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                String message = "User not found";
                return ResponseEntity.badRequest().body(message);
            }
        } catch (Exception e) {
            String message = "An error occurred while fetching the user.";
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PutMapping("/editUser/{userId}")
    public ResponseEntity<?> editUser(@PathVariable("userId") Long userId,
                                      @ModelAttribute User updatedUser,
                                      @RequestParam(value = "avatar", required = false) MultipartFile avatarFile) {
        try {
            User existingUser = userRepository.findById(userId).orElse(null);
            if (existingUser == null) {
                String message = "User not found";
                return ResponseEntity.badRequest().body(message);
            }

            // Check if username or email already exists for another user
            User userWithSameUsername = userRepository.findByUsernameAndIdNot(updatedUser.getUsername(), userId);
            if (userWithSameUsername != null) {
                String message = "A user with the same username already exists";
                return ResponseEntity.badRequest().body(message);
            }

            User userWithSameEmail = userRepository.findByEmailAndIdNot(updatedUser.getEmail(), userId);
            if (userWithSameEmail != null) {
                String message = "A user with the same email already exists";
                return ResponseEntity.badRequest().body(message);
            }

            existingUser.setNickname(updatedUser.getNickname());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setPassword(hashPassword(updatedUser.getPassword()));

            if (avatarFile != null) {
                String avatarPath = saveAvatarImage(avatarFile);
                existingUser.setAvatarPath(avatarPath);
            }

            User savedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            String message = "An error occurred while updating the user.";
            return ResponseEntity.badRequest().body(message);
        }
    }

}
