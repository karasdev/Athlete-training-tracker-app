package com.karasdev.mymobileapp.service;

import com.karasdev.mymobileapp.config.JwtService;
import com.karasdev.mymobileapp.domain.AppUser;
import com.karasdev.mymobileapp.repo.AppUserRepository;
import com.karasdev.mymobileapp.util.RecoveryHashUtil;
import com.karasdev.mymobileapp.web.dto.AuthResponse;
import com.karasdev.mymobileapp.web.dto.LoginRequest;
import com.karasdev.mymobileapp.web.dto.RegisterRequest;
import com.karasdev.mymobileapp.web.dto.ResetPasswordRequest;
import java.time.Instant;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

  private final AppUserRepository users;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(
      AppUserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.users = users;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  @Transactional
  public AuthResponse register(RegisterRequest req) {
    String email = req.email().trim().toLowerCase();
    if (users.findByEmailIgnoreCase(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
    }

    AppUser u = new AppUser();
    u.setEmail(email);
    u.setPasswordHash(passwordEncoder.encode(req.password()));
    u.setFavoriteAnimalHash(
        RecoveryHashUtil.sha256Hex(RecoveryHashUtil.normalize(req.favoriteAnimal())));
    u.setBirthdayHash(RecoveryHashUtil.sha256Hex(RecoveryHashUtil.normalize(req.birthday())));
    u.setPersonalInfoHash(
        RecoveryHashUtil.sha256Hex(RecoveryHashUtil.normalize(req.personalInfo())));
    u.setCreatedAt(Instant.now());

    try {
      users.save(u);
    } catch (DataIntegrityViolationException e) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
    }

    String token = jwtService.generateToken(u.getId(), u.getEmail());
    return new AuthResponse(token, u.getId().toString(), u.getEmail());
  }

  public AuthResponse login(LoginRequest req) {
    String email = req.email().trim().toLowerCase();
    AppUser u =
        users
            .findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

    if (!passwordEncoder.matches(req.password(), u.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    String token = jwtService.generateToken(u.getId(), u.getEmail());
    return new AuthResponse(token, u.getId().toString(), u.getEmail());
  }

  @Transactional
  public void resetPassword(ResetPasswordRequest req) {
    String email = req.email().trim().toLowerCase();
    AppUser u =
        users
            .findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));

    String fav = RecoveryHashUtil.sha256Hex(RecoveryHashUtil.normalize(req.favoriteAnimal()));
    String bday = RecoveryHashUtil.sha256Hex(RecoveryHashUtil.normalize(req.birthday()));
    String info = RecoveryHashUtil.sha256Hex(RecoveryHashUtil.normalize(req.personalInfo()));

    if (!u.getFavoriteAnimalHash().equals(fav)
        || !u.getBirthdayHash().equals(bday)
        || !u.getPersonalInfoHash().equals(info)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Recovery answers do not match");
    }

    u.setPasswordHash(passwordEncoder.encode(req.newPassword()));
    users.save(u);
  }

  public AppUser requireUser(UUID id) {
    return users
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid session"));
  }
}
