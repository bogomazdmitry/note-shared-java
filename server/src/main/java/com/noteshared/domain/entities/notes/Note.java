package com.noteshared.domain.entities.notes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.noteshared.domain.entities.notedesigns.NoteDesign;
import com.noteshared.domain.entities.notehistories.NoteHistory;
import com.noteshared.domain.entities.notetexts.NoteText;
import com.noteshared.domain.entities.users.User;
import lombok.*;
import org.hibernate.annotations.Cascade;
import org.springframework.stereotype.Service;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table
public class Note implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer order;

    @ToString.Exclude
    @JsonIgnore
    @ManyToOne
    private NoteText noteText;

    @ToString.Exclude
    @JsonIgnore
    @OneToOne
    private NoteDesign noteDesign;

    @ToString.Exclude
    @JsonIgnore
    @OneToOne
    private NoteHistory noteHistory;

    @ToString.Exclude
    @JsonIgnore
    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name="user_id")
    private User user;

    private UserRoleForNote userRole;
}
