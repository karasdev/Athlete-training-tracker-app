package com.karasdev.mymobileapp.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

public final class RecoveryHashUtil {

  private RecoveryHashUtil() {}

  public static String normalize(String value) {
    return value.trim().toLowerCase();
  }

  public static String sha256Hex(String normalizedAnswer) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(normalizedAnswer.getBytes(StandardCharsets.UTF_8));
      return HexFormat.of().formatHex(hash);
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException(e);
    }
  }
}
