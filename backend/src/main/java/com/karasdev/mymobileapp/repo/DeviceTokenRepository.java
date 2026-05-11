package com.karasdev.mymobileapp.repo;

import com.karasdev.mymobileapp.domain.AppUser;
import com.karasdev.mymobileapp.domain.DeviceToken;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceTokenRepository extends JpaRepository<DeviceToken, UUID> {

  Optional<DeviceToken> findByUserAndTokenDocId(AppUser user, String tokenDocId);

  void deleteByUserAndTokenDocId(AppUser user, String tokenDocId);

  List<DeviceToken> findByUser(AppUser user);
}
