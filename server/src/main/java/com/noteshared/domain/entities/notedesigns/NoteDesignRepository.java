package com.noteshared.domain.entities.notedesigns;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteDesignRepository extends JpaRepository<NoteDesign, Integer> {
}