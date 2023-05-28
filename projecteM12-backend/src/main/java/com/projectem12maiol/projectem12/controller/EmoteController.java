package com.projectem12maiol.projectem12.controller;

import com.projectem12maiol.projectem12.model.Emote;
import com.projectem12maiol.projectem12.model.Message;
import com.projectem12maiol.projectem12.model.User;
import com.projectem12maiol.projectem12.repository.EmoteRepository;
import com.projectem12maiol.projectem12.repository.MessageRepository;
import com.projectem12maiol.projectem12.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/emotes")
public class EmoteController {



    private final UserRepository userRepository;
    private final EmoteRepository emoteRepository;
    private final MessageRepository messageRepository;

    @Autowired
    public EmoteController(UserRepository userRepository, EmoteRepository emoteRepository, MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.emoteRepository = emoteRepository;
        this.messageRepository = messageRepository;
    }

    @PostMapping("/sendEmote")
    public ResponseEntity<String> sendEmote(
            @RequestBody Map<String, Long> emoteData
    ) {
        Long senderId = emoteData.get("senderId");
        Long receiverId = emoteData.get("receiverId");
        Long emoteId = emoteData.get("emoteId");

        if (senderId == null || receiverId == null || emoteId == null) {
            return ResponseEntity.badRequest().body("Invalid or missing parameters");
        }

        try {
            User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid senderId"));
            User receiver = userRepository.findById(receiverId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid receiverId"));
            Emote emote = emoteRepository.findById(emoteId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid emoteId"));

            LocalDateTime currentDateTime = LocalDateTime.now();
            Message message = new Message(emote.getName(), currentDateTime, sender, receiver);
            message.setEmote(emote);
            Message createdMessage = messageRepository.save(message);

            return ResponseEntity.ok("Emote sent successfully");
        } catch (IllegalArgumentException e) {

            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid senderId, receiverId, or emoteId");
        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending emote");
        }
    }

    @PostMapping("/createEmote")
    public ResponseEntity<String> createEmote(@RequestParam("name") String name, @RequestParam("imagePath") MultipartFile image) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body("Emote image is required");
        }

        try {
            String originalFileName = StringUtils.cleanPath(image.getOriginalFilename());
            String fileName = System.currentTimeMillis() + "_" + originalFileName;
            Path uploadPath = Paths.get("../projectem12/public/emote/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            image.transferTo(filePath);


            Emote emote = new Emote(name, "emote/" + fileName);
            emoteRepository.save(emote);

            return ResponseEntity.ok("Emote created successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the emote");
        }
    }
    @GetMapping
    public List<Emote> getAllEmotes() {
        return emoteRepository.findAll();
    }

    @GetMapping("/getEmotes")
    public ResponseEntity<List<Emote>> getEmotes() {
        List<Emote> emotes = emoteRepository.findAll();
        return ResponseEntity.ok(emotes);
    }

    @PutMapping("/{id}/changeStatus")
    public ResponseEntity<Emote> changeEmoteStatus(@PathVariable Long id) {
        Optional<Emote> optionalEmote = emoteRepository.findById(id);
        if (optionalEmote.isPresent()) {
            Emote emote = optionalEmote.get();
            emote.setStatus(!emote.isStatus());
            Emote updatedEmote = emoteRepository.save(emote);
            return ResponseEntity.ok(updatedEmote);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<String> updateEmote(
            @PathVariable("id") Long id,
            @RequestParam("name") String name,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            Emote emote = emoteRepository.findById(id).orElse(null);
            if (emote == null) {
                return ResponseEntity.notFound().build();
            }

            emote.setName(name);

            if (image != null && !image.isEmpty()) {
                String originalFileName = StringUtils.cleanPath(image.getOriginalFilename());
                String fileName = System.currentTimeMillis() + "_" + originalFileName;
                Path uploadPath = Paths.get("../projectem12/public/emote/");
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                image.transferTo(filePath);
                emote.setImagePath("emote/" + fileName);
            }

            emoteRepository.save(emote);

            return ResponseEntity.ok("Emote updated successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the emote");
        }
    }
    @GetMapping("/getEmoteById/{id}")
    public ResponseEntity<Emote> getEmoteById(@PathVariable("id") Long id) {
        Optional<Emote> optionalEmote = emoteRepository.findById(id);
        if (optionalEmote.isPresent()) {
            Emote emote = optionalEmote.get();
            return ResponseEntity.ok(emote);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
