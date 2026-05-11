package com.karasdev.mymobileapp.service;

import com.karasdev.mymobileapp.domain.AppUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Placeholder for server-initiated push. Device tokens may still be stored in PostgreSQL if you add a
 * transport later (e.g. HTTP push provider).
 */
@Service
public class PushNotificationService {

  private static final Logger log = LoggerFactory.getLogger(PushNotificationService.class);

  public void sendWorkoutLogged(AppUser user, String workoutType, int durationMinutes) {
    log.debug(
        "Workout logged notification skipped (no push backend): user={} type={} duration={}",
        user.getId(),
        workoutType,
        durationMinutes);
  }
}
