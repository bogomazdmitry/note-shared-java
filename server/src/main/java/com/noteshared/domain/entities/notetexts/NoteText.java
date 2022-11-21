package com.noteshared.domain.entities.notetexts;

import com.noteshared.domain.entities.notes.Note;
import lombok.Data;

import javax.persistence.*;
import java.util.Collection;

@Data
@Entity
@Table
public class NoteText {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    private String text;

    @OneToMany
    private Collection<Note> notes;
}
