package com.karasdev.mymobileapp.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  private final JwtProperties props;

  public JwtService(JwtProperties props) {
    this.props = props;
  }

  private SecretKey key() {
    return Keys.hmacShaKeyFor(props.getSecret().getBytes(StandardCharsets.UTF_8));
  }

  public String generateToken(UUID userId, String email) {
    Date now = new Date();
    Date exp = new Date(now.getTime() + props.getExpirationMs());
    return Jwts.builder()
        .subject(userId.toString())
        .claim("email", email)
        .issuedAt(now)
        .expiration(exp)
        .signWith(key())
        .compact();
  }

  public UUID parseUserId(String token) {
    Claims claims =
        Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
    return UUID.fromString(claims.getSubject());
  }

  public boolean validate(String token) {
    try {
      Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }
}
