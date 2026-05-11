package com.karasdev.mymobileapp.web.dto;

import jakarta.validation.constraints.NotBlank;

public record FcmTokenRequest(@NotBlank String token, String platform) {}
