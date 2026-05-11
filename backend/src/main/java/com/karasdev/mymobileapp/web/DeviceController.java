package com.karasdev.mymobileapp.web;

import com.karasdev.mymobileapp.domain.AppUser;
import com.karasdev.mymobileapp.service.AuthService;
import com.karasdev.mymobileapp.service.DeviceTokenService;
import com.karasdev.mymobileapp.web.dto.FcmTokenRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/devices/fcm")
public class DeviceController {

  private final AuthService authService;
  private final DeviceTokenService deviceTokens;

  public DeviceController(AuthService authService, DeviceTokenService deviceTokens) {
    this.authService = authService;
    this.deviceTokens = deviceTokens;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void register(Authentication authentication, @Valid @RequestBody FcmTokenRequest body) {
    AppUser user = authService.requireUser(UUID.fromString(authentication.getName()));
    String platform =
        body.platform() != null && !body.platform().isBlank() ? body.platform() : "android";
    deviceTokens.upsert(user, body.token(), platform);
  }

  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void remove(Authentication authentication, @Valid @RequestBody FcmTokenRequest body) {
    AppUser user = authService.requireUser(UUID.fromString(authentication.getName()));
    deviceTokens.remove(user, body.token());
  }
}
