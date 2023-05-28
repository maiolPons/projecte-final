package com.projectem12maiol.projectem12.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@Builder
public class Party {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @OneToOne
    @JoinColumn(name = "member1_fk")
    private Member member1;

    @OneToOne
    @JoinColumn(name = "member2_fk")
    private Member member2;

    @OneToOne
    @JoinColumn(name = "member3_fk")
    private Member member3;

    @OneToOne
    @JoinColumn(name = "member4_fk")
    private Member member4;

    @OneToOne
    @JoinColumn(name = "member5_fk")
    private Member member5;

    @OneToOne
    @JoinColumn(name = "member6_fk")
    private Member member6;

    @OneToOne
    @JoinColumn(name = "member7_fk")
    private Member member7;

    @OneToOne
    @JoinColumn(name = "member8_fk")
    private Member member8;

    @ManyToOne
    @JoinColumn(name = "fk_raid")
    private Raid raid;

    private LocalDateTime creationDate;


    public Party() {
        this.creationDate = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Member getMember1() {
        return member1;
    }

    public void setMember1(Member member1) {
        this.member1 = member1;
    }

    public Member getMember2() {
        return member2;
    }

    public void setMember2(Member member2) {
        this.member2 = member2;
    }

    public Member getMember3() {
        return member3;
    }

    public void setMember3(Member member3) {
        this.member3 = member3;
    }

    public Member getMember4() {
        return member4;
    }

    public void setMember4(Member member4) {
        this.member4 = member4;
    }

    public Member getMember5() {
        return member5;
    }

    public void setMember5(Member member5) {
        this.member5 = member5;
    }

    public Member getMember6() {
        return member6;
    }

    public void setMember6(Member member6) {
        this.member6 = member6;
    }

    public Member getMember7() {
        return member7;
    }

    public void setMember7(Member member7) {
        this.member7 = member7;
    }

    public Member getMember8() {
        return member8;
    }

    public void setMember8(Member member8) {
        this.member8 = member8;
    }

    public Raid getRaid() {
        return raid;
    }

    public void setRaid(Raid raid) {
        this.raid = raid;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }
}
