package harustudy.backend.room.dto;

import jakarta.validation.constraints.NotNull;

public record ParticipateRequest(@NotNull String nickname) {

}
