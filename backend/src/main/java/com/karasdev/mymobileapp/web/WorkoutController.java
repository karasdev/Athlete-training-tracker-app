package com.karasdev.mymobileapp.web;

import com.karasdev.mymobileapp.domain.AppUser;
import com.karasdev.mymobileapp.service.AuthService;
import com.karasdev.mymobileapp.service.WorkoutApiService;
import com.karasdev.mymobileapp.web.dto.WorkoutRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/workouts")
public class WorkoutController {

  private final AuthService authService;
  private final WorkoutApiService workoutApiService;

  public WorkoutController(AuthService authService, WorkoutApiService workoutApiService) {
    this.authService = authService;
    this.workoutApiService = workoutApiService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public void create(Authentication authentication, @Valid @RequestBody WorkoutRequest body) {
    AppUser user = authService.requireUser(UUID.fromString(authentication.getName()));
    workoutApiService.saveAndNotify(user, body);
  }
}
