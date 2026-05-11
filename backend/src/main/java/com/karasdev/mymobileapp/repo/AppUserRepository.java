package com.karasdev.mymobileapp.repo;

import com.karasdev.mymobileapp.domain.AppUser;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {

  Optional<AppUser> findByEmailIgnoreCase(String email);
}
