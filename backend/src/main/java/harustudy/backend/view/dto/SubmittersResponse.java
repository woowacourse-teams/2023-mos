package harustudy.backend.view.dto;

import java.util.List;

public record SubmittersResponse(List<SubmitterResponse> status) {

    public static SubmittersResponse from(List<SubmitterResponse> submitterResponses) {
        return new SubmittersResponse(submitterResponses);
    }
}
