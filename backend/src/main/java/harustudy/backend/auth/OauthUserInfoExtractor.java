package harustudy.backend.auth;

import harustudy.backend.auth.dto.UserInfo;
import java.util.Arrays;
import java.util.Map;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum OauthUserInfoExtractor {
  GOOGLE("google") {
    @Override
    public UserInfo of(Map<String, Object> attributes) {
      return UserInfo.builder()
          .name(String.valueOf(attributes.get("name")))
          .email(String.valueOf(attributes.get("email")))
          .imageUrl(String.valueOf(attributes.get("picture")))
          .build();
    }
  };

  private final String providerName;

  public static UserInfo extract(String providerName, Map<String, Object> attributes) {
    return Arrays.stream(values())
        .filter(provider -> providerName.equals(provider.providerName))
        .findFirst()
        .orElseThrow(IllegalStateException::new)
        .of(attributes);
  }

  public abstract UserInfo of(Map<String, Object> attributes);
}
