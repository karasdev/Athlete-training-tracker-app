package com.karasdev.mymobileapp.repo;

import com.karasdev.mymobileapp.domain.WorkoutEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutRepository extends JpaRepository<WorkoutEntity, UUID> {}
