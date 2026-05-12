package com.karasdev.mymobileapp.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.AndroidConfig;
import com.google.firebase.messaging.AndroidNotification;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.karasdev.mymobileapp.domain.AppUser;
import com.karasdev.mymobileapp.domain.DeviceToken;
import com.karasdev.mymobileapp.repo.DeviceTokenRepository;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PushNotificationService {

  private static final Logger log = LoggerFactory.getLogger(PushNotificationService.class);

  private final DeviceTokenRepository deviceTokens;
  private final String serviceAccountPath;
  private final String projectId;
  private FirebaseMessaging messaging;
  private boolean firebaseInitFailed;

  public PushNotificationService(
      DeviceTokenRepository deviceTokens,
      @Value("${firebase.service-account-path:}") String serviceAccountPath,
      @Value("${firebase.project-id:}") String projectId) {
    this.deviceTokens = deviceTokens;
    this.serviceAccountPath = serviceAccountPath;
    this.projectId = projectId;
  }

  @Transactional
  public void sendWorkoutLogged(AppUser user, String workoutType, int durationMinutes) {
    Optional<FirebaseMessaging> firebaseMessaging = getMessaging();
    if (firebaseMessaging.isEmpty()) {
      log.debug("Workout push skipped because Firebase Messaging is not configured");
      return;
    }

    List<DeviceToken> tokens = deviceTokens.findByUser(user);
    if (tokens.isEmpty()) {
      log.debug("Workout push skipped because user has no device tokens: user={}", user.getId());
      return;
    }

    String title = "Workout logged";
    String body = String.format("%s workout saved (%d min)", workoutType, durationMinutes);

    for (DeviceToken deviceToken : tokens) {
      sendToToken(firebaseMessaging.get(), deviceToken, title, body);
    }
  }

  private void sendToToken(
      FirebaseMessaging firebaseMessaging, DeviceToken deviceToken, String title, String body) {
    Message message =
        Message.builder()
            .setToken(deviceToken.getToken())
            .setNotification(Notification.builder().setTitle(title).setBody(body).build())
            .setAndroidConfig(
                AndroidConfig.builder()
                    .setPriority(AndroidConfig.Priority.HIGH)
                    .setNotification(
                        AndroidNotification.builder().setChannelId("default").build())
                    .build())
            .build();

    try {
      String messageId = firebaseMessaging.send(message);
      log.info("Sent workout push notification: tokenDocId={} messageId={}", deviceToken.getTokenDocId(), messageId);
    } catch (FirebaseMessagingException e) {
      String code = e.getMessagingErrorCode() != null ? e.getMessagingErrorCode().name() : "";
      if (isStaleTokenCode(code)) {
        deviceTokens.delete(deviceToken);
        log.info("Removed stale FCM token: tokenDocId={} code={}", deviceToken.getTokenDocId(), code);
        return;
      }

      log.warn(
          "Failed to send workout push notification: tokenDocId={} code={} message={}",
          deviceToken.getTokenDocId(),
          code,
          e.getMessage());
    }
  }

  private boolean isStaleTokenCode(String code) {
    return code.equals("UNREGISTERED") || code.equals("INVALID_ARGUMENT");
  }

  private synchronized Optional<FirebaseMessaging> getMessaging() {
    if (messaging != null) {
      return Optional.of(messaging);
    }

    if (firebaseInitFailed) {
      return Optional.empty();
    }

    if (serviceAccountPath == null || serviceAccountPath.isBlank()) {
      firebaseInitFailed = true;
      log.warn(
          "Firebase service account is not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS to enable push notifications.");
      return Optional.empty();
    }

    try (FileInputStream serviceAccount = new FileInputStream(serviceAccountPath)) {
      FirebaseOptions.Builder options =
          FirebaseOptions.builder().setCredentials(GoogleCredentials.fromStream(serviceAccount));

      if (projectId != null && !projectId.isBlank()) {
        options.setProjectId(projectId);
      }

      FirebaseApp app =
          FirebaseApp.getApps().isEmpty()
              ? FirebaseApp.initializeApp(options.build())
              : FirebaseApp.getInstance();

      messaging = FirebaseMessaging.getInstance(app);
      log.info("Firebase Messaging initialized for project={}", projectId);
      return Optional.of(messaging);
    } catch (IOException | IllegalStateException e) {
      firebaseInitFailed = true;
      log.warn("Firebase Messaging initialization failed: {}", e.getMessage());
      return Optional.empty();
    }
  }
}
