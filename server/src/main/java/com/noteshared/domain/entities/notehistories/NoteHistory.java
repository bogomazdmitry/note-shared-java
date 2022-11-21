package com.noteshared.domain.entities.notehistories;

import com.noteshared.domain.entities.notes.Note;
import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Data
@Entity
@Table
public class NoteHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Date createdDateTime;

    private Date lastChangesDateTime;

    @OneToOne
    private Note note;
}
