package com.noteshared.domain.entities.notes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.noteshared.domain.entities.notedesigns.NoteDesign;
import com.noteshared.domain.entities.notehistories.NoteHistory;
import com.noteshared.domain.entities.notetexts.NoteText;
import com.noteshared.domain.entities.users.User;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer order;

    @ManyToOne
    private NoteText noteText;

    @OneToOne
    private NoteDesign noteDesign;

    @OneToOne
    private NoteHistory noteHistory;

    @ManyToOne
    private User user;

    private UserRoleForNote userRole;
}
