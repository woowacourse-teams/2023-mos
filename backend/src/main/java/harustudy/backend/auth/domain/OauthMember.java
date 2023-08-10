package harustudy.backend.auth.domain;

import harustudy.backend.common.BaseTimeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class OauthMember extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private LoginType loginType;

    public OauthMember(String name, String email, String imageUrl, LoginType loginType) {
        this.name = name;
        this.email = email;
        this.imageUrl = imageUrl;
        this.loginType = loginType;
    }

    public static OauthMember guest() {
        return new OauthMember("guest", null, null, LoginType.GUEST);
    }

    public OauthMember update(String name, String email, String imageUrl) {
        return new OauthMember(name, email, imageUrl, this.loginType);
    }
}
