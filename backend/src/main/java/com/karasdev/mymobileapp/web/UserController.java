package com.karasdev.mymobileapp.web;

import com.karasdev.mymobileapp.domain.AppUser;
import com.karasdev.mymobileapp.service.AuthService;
import com.karasdev.mymobileapp.web.dto.UserMeResponse;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

  private final AuthService authService;

  public UserController(AuthService authService) {
    this.authService = authService;
  }

  @GetMapping("/me")
  public UserMeResponse me(Authentication authentication) {
    UUID id = UUID.fromString(authentication.getName());
    AppUser u = authService.requireUser(id);
    return new UserMeResponse(u.getId().toString(), u.getEmail());
  }
}
