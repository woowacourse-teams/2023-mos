package harustudy.backend.progress.controller;

import harustudy.backend.auth.Authenticated;
import harustudy.backend.auth.dto.AuthMember;
import harustudy.backend.progress.dto.ParticipateStudyRequest;
import harustudy.backend.progress.dto.PomodoroProgressResponse;
import harustudy.backend.progress.dto.PomodoroProgressesResponse;
import harustudy.backend.progress.service.PomodoroProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "진행 관련 기능")
@RequiredArgsConstructor
@RestController
public class PomodoroProgressController {

    private final PomodoroProgressService pomodoroProgressService;

    @Operation(summary = "단일 스터디 진행도 조회")
    @GetMapping("/api/studies/{studyId}/progresses/{progressId}")
    public ResponseEntity<PomodoroProgressResponse> findPomodoroProgress(
            @Authenticated AuthMember authMember,
            @PathVariable Long studyId,
            @PathVariable Long progressId
    ) {
        PomodoroProgressResponse response =
                pomodoroProgressService.findPomodoroProgress(authMember, studyId, progressId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "필터링 조건으로 스터디 진행도 조회")
    @GetMapping("/api/studies/{studyId}/progresses")
    public ResponseEntity<PomodoroProgressesResponse> findPomodoroProgressesWithFilter(
            @Authenticated AuthMember authMember,
            @PathVariable Long studyId,
            @RequestParam(required = false) Long memberId
    ) {
        PomodoroProgressesResponse response =
                pomodoroProgressService.findPomodoroProgressWithFilter(authMember, studyId, memberId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "다음 스터디 단계로 이동")
    @ApiResponse(responseCode = "204")
    @PostMapping("/api/studies/{studyId}/progresses/{progressId}/next-step")
    public ResponseEntity<Void> proceed(
            @Authenticated AuthMember authMember,
            @PathVariable Long studyId,
            @PathVariable Long progressId
    ) {
        pomodoroProgressService.proceed(authMember, studyId, progressId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "스터디 참여")
    @ApiResponse(responseCode = "201")
    @PostMapping("/api/studies/{studyId}/progresses")
    public ResponseEntity<Void> participate(
            @Authenticated AuthMember authMember,
            @PathVariable Long studyId,
            @RequestBody ParticipateStudyRequest request
    ) {
        Long progressId = pomodoroProgressService.participateStudy(authMember, studyId, request);
        return ResponseEntity.created(
                URI.create("/api/v3/studies/" + studyId + "/progresses/" + progressId)).build();
    }
}
