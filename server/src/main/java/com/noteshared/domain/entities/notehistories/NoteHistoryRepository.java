package com.noteshared.domain.entities.notehistories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteHistoryRepository extends JpaRepository<NoteHistory, Integer> {
}