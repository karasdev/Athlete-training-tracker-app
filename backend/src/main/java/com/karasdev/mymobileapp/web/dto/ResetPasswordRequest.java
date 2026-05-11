package com.karasdev.mymobileapp.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
    @NotBlank @Email String email,
    @NotBlank String favoriteAnimal,
    @NotBlank String birthday,
    @NotBlank String personalInfo,
    @NotBlank @Size(min = 6) String newPassword) {}
