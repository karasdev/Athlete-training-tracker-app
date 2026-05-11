package com.karasdev.mymobileapp.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "app_users")
public class AppUser {

  @Id
  @GeneratedValue
  private UUID id;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(name = "password_hash", nullable = false)
  private String passwordHash;

  @Column(name = "favorite_animal_hash", nullable = false)
  private String favoriteAnimalHash;

  @Column(name = "birthday_hash", nullable = false)
  private String birthdayHash;

  @Column(name = "personal_info_hash", nullable = false)
  private String personalInfoHash;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public String getFavoriteAnimalHash() {
    return favoriteAnimalHash;
  }

  public void setFavoriteAnimalHash(String favoriteAnimalHash) {
    this.favoriteAnimalHash = favoriteAnimalHash;
  }

  public String getBirthdayHash() {
    return birthdayHash;
  }

  public void setBirthdayHash(String birthdayHash) {
    this.birthdayHash = birthdayHash;
  }

  public String getPersonalInfoHash() {
    return personalInfoHash;
  }

  public void setPersonalInfoHash(String personalInfoHash) {
    this.personalInfoHash = personalInfoHash;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
