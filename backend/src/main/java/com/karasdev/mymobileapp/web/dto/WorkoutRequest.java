package com.karasdev.mymobileapp.web.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record WorkoutRequest(
    @NotBlank String id,
    @NotBlank String type,
    @Min(1) int duration,
    @Min(1) @Max(10) int intensity,
    String notes,
    String createdAt) {}
