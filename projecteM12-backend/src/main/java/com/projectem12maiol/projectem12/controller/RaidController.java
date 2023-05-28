package com.projectem12maiol.projectem12.controller;

import com.projectem12maiol.projectem12.model.Raid;
import com.projectem12maiol.projectem12.repository.RaidRepository;
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
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/raids")
public class RaidController {

    private final RaidRepository raidRepository;

    @Autowired
    public RaidController(RaidRepository raidRepository) {
        this.raidRepository = raidRepository;
    }

    @PostMapping("/createRaid")
    public ResponseEntity<String> createRaid(@RequestParam("name") String name, @RequestParam("image") MultipartFile image, @RequestParam("lvl") int lvl) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body("Raid image is required");
        }

        try {
            String originalFileName = StringUtils.cleanPath(image.getOriginalFilename());
            String fileName = System.currentTimeMillis() + "_" + originalFileName;
            Path uploadPath = Paths.get("../projectem12/public/raid/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            image.transferTo(filePath);


            Raid raid = Raid.builder()
                    .name(name)
                    .image("raid/" + fileName)
                    .lvl(lvl)
                    .build();
            raidRepository.save(raid);

            return ResponseEntity.ok("Raid created successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the raid");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateRaid(
            @PathVariable("id") Long id,
            @RequestParam("name") String name,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("lvl") int lvl
    ) {
        try {
            Raid raid = raidRepository.findById(id).orElse(null);
            if (raid == null) {
                return ResponseEntity.notFound().build();
            }

            raid.setName(name);
            raid.setLvl(lvl);

            if (image != null && !image.isEmpty()) {
                String originalFileName = StringUtils.cleanPath(image.getOriginalFilename());
                String fileName = System.currentTimeMillis() + "_" + originalFileName;
                Path uploadPath = Paths.get("../projectem12/public/raid/");
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                image.transferTo(filePath);
                raid.setImage("raid/" + fileName);
            }
            raidRepository.save(raid);

            return ResponseEntity.ok("Raid updated successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the raid");
        }
    }
    @GetMapping("/getRaids")
    public List<Raid> getAllRaids() {
        return raidRepository.findAll();
    }
    @GetMapping("/getRaidById/{raidId}")
    public ResponseEntity<Raid> getRaidById(@PathVariable Long raidId) {
        Raid raid = raidRepository.findById(raidId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid raid ID: " + raidId));
        return ResponseEntity.ok(raid);
    }
    @PutMapping("/{id}/changeStatus")
    public ResponseEntity<Raid> changeRaidStatus(@PathVariable Long id) {
        Optional<Raid> optionalRaid = raidRepository.findById(id);
        if (optionalRaid.isPresent()) {
            Raid raid = optionalRaid.get();
            raid.setStatus(!raid.isStatus());
            Raid updatedRaid = raidRepository.save(raid);
            return ResponseEntity.ok(updatedRaid);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/getRaidsTrue")
    public ResponseEntity<List<Raid>> getAllActiveRaids() {
        List<Raid> raids = raidRepository.findByStatusTrue();
        return ResponseEntity.ok(raids);
    }

}
