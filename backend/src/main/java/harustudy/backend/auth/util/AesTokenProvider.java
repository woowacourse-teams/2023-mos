package harustudy.backend.auth.util;

import harustudy.backend.auth.exception.InvalidAccessTokenException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Component;

@Component
public class AesTokenProvider {

    private static final String alg = "AES/CBC/PKCS5Padding";
    private static final String iv = "0123456789abcdef"; // 16byte
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("MMddHH:mm:ssyyyy");

    public String createAccessToken(Long subject, Long accessTokenExpireLength, String secretKey) {
        Date now = new Date();
        Date expireAt = new Date(now.getTime() + accessTokenExpireLength);
        String formatted = DATE_FORMAT.format(expireAt);
        String text = subject + " " + formatted;
        return encrypt(text, secretKey);
    }

    private String encrypt(String text, String secretKey) {
        try {
            Cipher cipher = Cipher.getInstance(alg);
            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
            IvParameterSpec ivParamSpec = new IvParameterSpec(iv.getBytes());
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivParamSpec);

            byte[] encrypted = cipher.doFinal(text.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (GeneralSecurityException e) {
            throw new InvalidAccessTokenException(e);
        }
    }

    public Long parseSubject(String accessToken, String secretKey) {
        String[] splitted = decrypt(accessToken, secretKey);
        validateLength(splitted);
        validateExpiration(splitted);
        return parseSubject(splitted);
    }

    private String[] decrypt(String accessToken, String secretKey) {
        try {
            Cipher cipher = Cipher.getInstance(alg);
            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
            IvParameterSpec ivParamSpec = new IvParameterSpec(iv.getBytes());
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivParamSpec);

            byte[] decodedBytes = Base64.getDecoder().decode(accessToken);
            byte[] decrypted = cipher.doFinal(decodedBytes);
            String string = new String(decrypted, StandardCharsets.UTF_8);
            return string.split(" ");
        } catch (GeneralSecurityException | IllegalArgumentException e) {
            throw new InvalidAccessTokenException();
        }
    }

    private void validateLength(String[] splitted) {
        if (splitted.length != 2) {
            throw new InvalidAccessTokenException();
        }
    }

    private void validateExpiration(String[] splitted) {
        Date expireAt = parseExpirationDate(splitted);
        if (expireAt.before(new Date())) {
            throw new InvalidAccessTokenException();
        }
    }

    private Date parseExpirationDate(String[] splitted) {
        try {
            return DATE_FORMAT.parse(splitted[1]);
        } catch (ParseException e) {
            throw new InvalidAccessTokenException();
        }
    }

    private Long parseSubject(String[] splitted) {
        return Long.parseLong(splitted[0]);
    }
}
