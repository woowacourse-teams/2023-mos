package harustudy.backend.participantcode.domain;

import jakarta.persistence.Transient;
import java.time.LocalDateTime;
import lombok.Getter;

@Getter
public class ParticipantCode {

//    private Long id;

    //    @OneToOne
    private final Long studyId;

    @Transient
    private GenerationStrategy generationStrategy;

    //    @Indexed
    private String code;

    //    @TimeToLive
    private Long expirationPeriod;

    @Transient
    private LocalDateTime createdDate;


    public ParticipantCode(Long studyId, GenerationStrategy generationStrategy) {
        this.studyId = studyId;
        this.generationStrategy = generationStrategy;
        this.code = generationStrategy.generate();
        this.expirationPeriod = generationStrategy.EXPIRATION_PERIOD_IN_SECONDS;
        this.createdDate = generationStrategy.getCreatedDate();
    }

    public void regenerate() {
        String generated = code;
        while (code.equals(generated)) {
            generated = generationStrategy.generate();
        }
        code = generated;
    }

    public boolean isExpired() {
        return createdDate.plusSeconds(expirationPeriod).isBefore(LocalDateTime.now());
    }
}
