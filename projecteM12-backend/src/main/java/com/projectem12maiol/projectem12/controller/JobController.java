package com.projectem12maiol.projectem12.controller;

import com.projectem12maiol.projectem12.model.Job;
import com.projectem12maiol.projectem12.repository.JobRepository;
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
@RequestMapping("/jobs")
public class JobController {

    private final JobRepository jobRepository;

    @Autowired
    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @PostMapping("/createJob")
    public ResponseEntity<String> createJob(
            @RequestParam("name") String name,
            @RequestParam("image") MultipartFile image,
            @RequestParam("role") String role
    ) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body("Job image is required");
        }

        try {
            String originalFileName = StringUtils.cleanPath(image.getOriginalFilename());
            String fileName = System.currentTimeMillis() + "_" + originalFileName;
            Path uploadPath = Paths.get("../projectem12/public/job/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            image.transferTo(filePath);


            Job job = Job.builder()
                    .name(name)
                    .image("job/" + fileName)
                    .role(role)
                    .build();
            jobRepository.save(job);

            return ResponseEntity.ok("Job created successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the job");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateJob(
            @PathVariable("id") Long id,
            @RequestParam("name") String name,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("role") String role
    ) {
        try {
            Job job = jobRepository.findById(id).orElse(null);
            if (job == null) {
                return ResponseEntity.notFound().build();
            }

            job.setName(name);
            job.setRole(role);

            if (image != null && !image.isEmpty()) {
                String originalFileName = StringUtils.cleanPath(image.getOriginalFilename());
                String fileName = System.currentTimeMillis() + "_" + originalFileName;
                Path uploadPath = Paths.get("../projectem12/public/job/");
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                image.transferTo(filePath);
                job.setImage("job/" + fileName);
            }

            jobRepository.save(job);

            return ResponseEntity.ok("Job updated successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the job");
        }
    }

    @GetMapping("/getJobs")
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("/getJobById/{jobId}")
    public ResponseEntity<Job> getJobById(@PathVariable Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid job ID: " + jobId));
        return ResponseEntity.ok(job);
    }

    @PutMapping("/{id}/changeStatus")
    public ResponseEntity<Job> changeJobStatus(@PathVariable Long id) {
        Optional<Job> optionalJob = jobRepository.findById(id);
        if (optionalJob.isPresent()) {
            Job job = optionalJob.get();
            job.setStatus(!job.isStatus());
            Job updatedJob = jobRepository.save(job);
            return ResponseEntity.ok(updatedJob);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/getJobsByRole/{role}")
    public List<Job> getJobsByRole(@PathVariable String role) {

        return jobRepository.findByRoleAndStatus(role,true);
    }
}
