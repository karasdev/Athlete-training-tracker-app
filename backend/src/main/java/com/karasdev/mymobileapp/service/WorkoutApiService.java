package com.karasdev.mymobileapp.service;

import com.karasdev.mymobileapp.domain.AppUser;
import com.karasdev.mymobileapp.domain.WorkoutEntity;
import com.karasdev.mymobileapp.repo.WorkoutRepository;
import com.karasdev.mymobileapp.web.dto.WorkoutRequest;
import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkoutApiService {

  private final WorkoutRepository workouts;
  private final PushNotificationService push;

  public WorkoutApiService(WorkoutRepository workouts, PushNotificationService push) {
    this.workouts = workouts;
    this.push = push;
  }

  @Transactional
  public void saveAndNotify(AppUser user, WorkoutRequest req) {
    Instant created =
        req.createdAt() != null ? Instant.parse(req.createdAt()) : Instant.now();

    WorkoutEntity w = new WorkoutEntity();
    w.setUser(user);
    w.setClientWorkoutId(req.id());
    w.setType(req.type());
    w.setDuration(req.duration());
    w.setIntensity(req.intensity());
    w.setNotes(req.notes() != null ? req.notes() : "");
    w.setCreatedAt(created);
    workouts.save(w);

    push.sendWorkoutLogged(user, req.type(), req.duration());
  }
}
