package com.noteshared.domain.entities.notetexts;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteTextRepository extends JpaRepository<NoteText, Integer> {
}