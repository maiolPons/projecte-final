package com.projectem12maiol.projectem12.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartyMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_party")
    private Party party;

    private String partyMemberNickname;

    @ManyToOne
    @JoinColumn(name = "fk_emote")
    private Emote emote;

    private LocalDateTime creationDate;

    private String message;


}

