package com.projectem12maiol.projectem12.controller;

import com.projectem12maiol.projectem12.model.Job;
import com.projectem12maiol.projectem12.model.Member;
import com.projectem12maiol.projectem12.model.User;
import com.projectem12maiol.projectem12.repository.JobRepository;
import com.projectem12maiol.projectem12.repository.MemberRepository;
import com.projectem12maiol.projectem12.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/members")
public class MemberController {

    private final MemberRepository memberRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    @Autowired
    public MemberController(MemberRepository memberRepository, JobRepository jobRepository, UserRepository userRepository) {
        this.memberRepository = memberRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/createMember")
    public Member createMember(@RequestBody Map<String, Object> memberRequest) {
        Long jobId = Long.parseLong(memberRequest.get("job").toString());

        // Fetch the job and user entities based on their IDs
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Invalid job ID"));
        User user = userRepository.findByUsername(memberRequest.get("user").toString());


        // Create the member entity and set the job and user
        Member member = new Member();
        member.setJob(job);
        member.setUser(user);

        // Save the member entity
        return memberRepository.save(member);
    }
}
