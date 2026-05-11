package com.karasdev.mymobileapp.service;

import com.karasdev.mymobileapp.domain.AppUser;
import com.karasdev.mymobileapp.domain.DeviceToken;
import com.karasdev.mymobileapp.repo.DeviceTokenRepository;
import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeviceTokenService {

  private final DeviceTokenRepository repo;

  public DeviceTokenService(DeviceTokenRepository repo) {
    this.repo = repo;
  }

  public static String tokenDocId(String token) {
    int colonIdx = token.indexOf(':');
    return colonIdx > 0 ? token.substring(0, colonIdx) : token;
  }

  @Transactional
  public void upsert(AppUser user, String token, String platform) {
    String docId = tokenDocId(token);
    DeviceToken dt =
        repo.findByUserAndTokenDocId(user, docId).orElseGet(DeviceToken::new);
    dt.setUser(user);
    dt.setTokenDocId(docId);
    dt.setToken(token);
    dt.setPlatform(platform);
    dt.setUpdatedAt(Instant.now());
    repo.save(dt);
  }

  @Transactional
  public void remove(AppUser user, String token) {
    repo.deleteByUserAndTokenDocId(user, tokenDocId(token));
  }
}
