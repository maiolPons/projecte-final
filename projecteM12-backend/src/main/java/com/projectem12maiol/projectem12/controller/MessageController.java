package com.projectem12maiol.projectem12.controller;

import com.projectem12maiol.projectem12.model.Message;
import com.projectem12maiol.projectem12.model.User;
import com.projectem12maiol.projectem12.repository.MessageRepository;
import com.projectem12maiol.projectem12.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Autowired
    public MessageController(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }


    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessagesBySenderAndReceiver(
            @RequestParam("senderId") Long senderId,
            @RequestParam("receiverId") Long receiverId
    ) {
        Optional<User> optionalSender = userRepository.findById(senderId);
        Optional<User> optionalReceiver = userRepository.findById(receiverId);

        if (optionalSender.isEmpty() || optionalReceiver.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User sender = optionalSender.get();
        User receiver = optionalReceiver.get();

        List<Message> messages = messageRepository.findBySenderAndRecipient(sender, receiver);
        return ResponseEntity.ok(messages);
    }





    @PostMapping("/addMessage")
    public ResponseEntity<Message> createMessage(@RequestBody Map<String, String> messageData) {
        LocalDateTime currentDateTime = LocalDateTime.now();

        String senderIdString = messageData.get("senderId");
        String receiverIdString = messageData.get("receiverId");
        String content = messageData.get("content");

        if (senderIdString != null && receiverIdString != null && content != null) {
            try {
                long senderId = Long.parseLong(senderIdString);
                long receiverId = Long.parseLong(receiverIdString);

                User sender = userRepository.findById(senderId)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid senderId"));
                User receiver = userRepository.findById(receiverId)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid receiverId"));

                Message message = new Message(content, currentDateTime, sender, receiver);
                Message createdMessage = messageRepository.save(message);

                return ResponseEntity.status(HttpStatus.CREATED).body(createdMessage);
            } catch (NumberFormatException e) {
                // Handle parsing errors
                e.printStackTrace();
                return ResponseEntity.badRequest().build();
            } catch (IllegalArgumentException e) {
                // Handle invalid senderId or receiverId
                e.printStackTrace();
                return ResponseEntity.badRequest().build();
            } catch (Exception e) {
                // Handle any other exceptions
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        // Handle invalid or missing parameters
        return ResponseEntity.badRequest().build();
    }



}
