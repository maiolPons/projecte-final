package com.projectem12maiol.projectem12.controller;

import com.projectem12maiol.projectem12.model.*;
import com.projectem12maiol.projectem12.repository.*;
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
@RequestMapping("/parties")
public class PartyController {

    private final MemberRepository memberRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final RaidRepository raidRepository;
    private final PartyRepository partyRepository;
    private final PartyMessageRepository partyMessageRepository;
    private final EmoteRepository emoteRepository;

    @Autowired
    public PartyController(MemberRepository memberRepository, JobRepository jobRepository, UserRepository userRepository, RaidRepository raidRepository, PartyRepository partyRepository,PartyMessageRepository partyMessageRepository, EmoteRepository emoteRepository) {
        this.memberRepository = memberRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.raidRepository = raidRepository;
        this.partyRepository = partyRepository;
        this.partyMessageRepository = partyMessageRepository;
        this.emoteRepository = emoteRepository;
    }

    @PostMapping("/createParty")
    public Party createParty(@RequestBody Map<String, Object> partyRequest) {
        String name = partyRequest.get("name").toString();
        String description = partyRequest.get("description").toString();
        Long raidId = Long.parseLong(partyRequest.get("raid").toString());
        Long idMember = Long.parseLong(partyRequest.get("idMember").toString());


        Raid raid = raidRepository.findById(raidId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid raid ID"));


        Party party = new Party();
        party.setName(name);
        party.setDescription(description);
        party.setRaid(raid);
        party.setCreationDate(LocalDateTime.now());



        Member member = memberRepository.findById(idMember)
                .orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));
        String role = member.getJob().getRole();
        System.out.println(role == "HEALER");
        if(role.equals("TANK")){
            party.setMember1(member);
        } else if (role.equals("HEALER")) {
            party.setMember3(member);
        }
        else{
            party.setMember5(member);
        }


        return partyRepository.save(party);
    }

    @GetMapping("/getAllParties")
    public List<Party> getAllParties() {
        return partyRepository.findAll();
    }

    @GetMapping("/partiesByRaid/{raidId}")
    public List<Party> getPartiesByRaid(@PathVariable Long raidId) {
        Raid raid = raidRepository.findById(raidId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid raid ID"));

        return partyRepository.findByRaid(raid);
    }

    @PostMapping("/partiesForMember/{username}")
    public List<Party> getPartiesForMemberWithUser(@PathVariable String username) {
        try {
            User user = userRepository.findByUsername(username);
            List<Member> members = memberRepository.findByUser(user);

            if (members.isEmpty()) {
                throw new IllegalArgumentException("Member not found for the given user");
            }

            Member member = members.get(0);

            return partyRepository.findByMember1OrMember2OrMember3OrMember4OrMember5OrMember6OrMember7OrMember8(member, member, member, member, member, member, member, member);
        } catch (Exception e) {

            return Collections.emptyList();
        }
    }


    @GetMapping("/partyById/{partyId}")
    public Party getPartyById(@PathVariable Long partyId) {
        Optional<Party> party = partyRepository.findById(partyId);
        return party.orElseThrow(() -> new IllegalArgumentException("Party not found"));
    }

    @PostMapping("/addMember")
    public Party addMemberToParty(@RequestBody Map<String, Object> request) {
        Long memberId = Long.parseLong(request.get("memberId").toString());
        Long partyId = Long.parseLong(request.get("partyId").toString());
        Integer index = Integer.parseInt(request.get("index").toString());


        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));


        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid party ID"));


        switch (index) {
            case 1:
                party.setMember1(member);
                break;
            case 2:
                party.setMember2(member);
                break;
            case 3:
                party.setMember3(member);
                break;
            case 4:
                party.setMember4(member);
                break;
            case 5:
                party.setMember5(member);
                break;
            case 6:
                party.setMember6(member);
                break;
            case 7:
                party.setMember7(member);
                break;
            case 8:
                party.setMember8(member);
                break;
            default:
                throw new IllegalArgumentException("Invalid index");
        }


        return partyRepository.save(party);
    }

    @PostMapping("/leaveParty")
    public void leaveParty(@RequestBody Map<String, Object> leaveRequest) {
        Long partyId = Long.parseLong(leaveRequest.get("partyId").toString());
        String currentUser = leaveRequest.get("currentUser").toString();

        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid party ID"));
        User user = userRepository.findByUsername(currentUser);
        if (hasMember(user, party)) {
            Member member = findMemberByUser(user, party);
            removeMemberFromParty(member, party);
            memberRepository.delete(member);
            if (areAllMembersNull(party)) {
                deletePartyMessages(party);
                partyRepository.delete(party);
            } else {
                partyRepository.save(party);
            }
        }
    }

    private void deletePartyMessages(Party party) {
        List<PartyMessage> partyMessages = partyMessageRepository.findByParty(party);
        partyMessageRepository.deleteAll(partyMessages);
    }


    private boolean hasMember(User user, Party party) {
        return party.getMember1() != null && party.getMember1().getUser().equals(user)
                || party.getMember2() != null && party.getMember2().getUser().equals(user)
                || party.getMember3() != null && party.getMember3().getUser().equals(user)
                || party.getMember4() != null && party.getMember4().getUser().equals(user)
                || party.getMember5() != null && party.getMember5().getUser().equals(user)
                || party.getMember6() != null && party.getMember6().getUser().equals(user)
                || party.getMember7() != null && party.getMember7().getUser().equals(user)
                || party.getMember8() != null && party.getMember8().getUser().equals(user);
    }

    private Member findMemberByUser(User user, Party party) {
        if (party.getMember1() != null && party.getMember1().getUser().equals(user)) {
            return party.getMember1();
        } else if (party.getMember2() != null && party.getMember2().getUser().equals(user)) {
            return party.getMember2();
        } else if (party.getMember3() != null && party.getMember3().getUser().equals(user)) {
            return party.getMember3();
        } else if (party.getMember4() != null && party.getMember4().getUser().equals(user)) {
            return party.getMember4();
        } else if (party.getMember5() != null && party.getMember5().getUser().equals(user)) {
            return party.getMember5();
        } else if (party.getMember6() != null && party.getMember6().getUser().equals(user)) {
            return party.getMember6();
        } else if (party.getMember7() != null && party.getMember7().getUser().equals(user)) {
            return party.getMember7();
        } else if (party.getMember8() != null && party.getMember8().getUser().equals(user)) {
            return party.getMember8();
        }
        return null;
    }

    private void removeMemberFromParty(Member member, Party party) {
        if (party.getMember1() != null && party.getMember1().equals(member)) {
            party.setMember1(null);
        } else if (party.getMember2() != null && party.getMember2().equals(member)) {
            party.setMember2(null);
        } else if (party.getMember3() != null && party.getMember3().equals(member)) {
            party.setMember3(null);
        } else if (party.getMember4() != null && party.getMember4().equals(member)) {
            party.setMember4(null);
        } else if (party.getMember5() != null && party.getMember5().equals(member)) {
            party.setMember5(null);
        } else if (party.getMember6() != null && party.getMember6().equals(member)) {
            party.setMember6(null);
        } else if (party.getMember7() != null && party.getMember7().equals(member)) {
            party.setMember7(null);
        } else if (party.getMember8() != null && party.getMember8().equals(member)) {
            party.setMember8(null);
        }
    }

    private boolean areAllMembersNull(Party party) {
        return party.getMember1() == null
                && party.getMember2() == null
                && party.getMember3() == null
                && party.getMember4() == null
                && party.getMember5() == null
                && party.getMember6() == null
                && party.getMember7() == null
                && party.getMember8() == null;
    }


    @PostMapping("/sendMessage")
    public void sendMessage(@RequestBody Map<String, Object> messageRequest) {
        Long partyId = Long.parseLong(messageRequest.get("partyId").toString());
        String currentUser = messageRequest.get("currentUser").toString();
        String message = messageRequest.get("message").toString();
        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid party ID"));
        User user = userRepository.findByUsername(currentUser);
        PartyMessage partyMessage = new PartyMessage();
        partyMessage.setParty(party);
        partyMessage.setPartyMemberNickname(user.getUsername());
        partyMessage.setCreationDate(LocalDateTime.now());
        partyMessage.setMessage(message);
        partyMessageRepository.save(partyMessage);
    }

    @PostMapping("/sendEmote")
    public void sendEmote(@RequestBody Map<String, Object> emoteRequest) {
        Long partyId = Long.parseLong(emoteRequest.get("partyId").toString());
        String currentUser = emoteRequest.get("currentUser").toString();
        Long emoteId = Long.parseLong(emoteRequest.get("emoteId").toString());
        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid party ID"));
        User user = userRepository.findByUsername(currentUser);

        Emote emote = emoteRepository.findById(emoteId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid emote ID"));
        PartyMessage partyMessage = new PartyMessage();
        partyMessage.setParty(party);
        partyMessage.setPartyMemberNickname(user.getUsername());
        partyMessage.setEmote(emote);
        partyMessage.setCreationDate(LocalDateTime.now());
        partyMessage.setMessage("");
        partyMessageRepository.save(partyMessage);
    }
    @GetMapping("/partyMessages/{partyId}")
    public ResponseEntity<List<PartyMessage>> getPartyMessages(@PathVariable Long partyId) {
        try {
            List<PartyMessage> partyMessages = partyMessageRepository.findByPartyId(partyId);
            return ResponseEntity.ok(partyMessages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
