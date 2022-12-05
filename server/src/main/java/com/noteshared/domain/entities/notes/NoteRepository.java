package com.noteshared.domain.entities.notes;

import com.noteshared.domain.entities.notetexts.NoteText;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Integer> {
    Optional<Collection<Note>> findAllByNoteText(NoteText noteText);
}