package harustudy.backend.view.controller;

import harustudy.backend.auth.Authenticated;
import harustudy.backend.auth.dto.AuthMember;
import harustudy.backend.view.dto.CalenderStudyRecordsResponse;
import harustudy.backend.view.dto.StudyRecordsPageResponse;
import harustudy.backend.view.service.ViewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "view 전용 조회 관련 기능")
@RequiredArgsConstructor
@RestController
public class ViewController {

    private final ViewService viewService;

    @Operation(summary = "스터디 기록 페이지 조회")
    @GetMapping("/api/view/study-records")
    public ResponseEntity<StudyRecordsPageResponse> findStudyRecordsPage(
            @Authenticated AuthMember authMember,
            @RequestParam Long memberId,
            @RequestParam Integer page,
            @RequestParam Integer size,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate
    ) {
        StudyRecordsPageResponse response = viewService.findStudyRecordsPage(
                memberId,
                page,
                size,
                startDate,
                endDate
        );
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "달력 기반 스터디 기록 조회")
    @GetMapping("/api/view/calender/study-records")
    public ResponseEntity<CalenderStudyRecordsResponse> findCalenderStudyRecords(
            @Authenticated AuthMember authMember,
            @RequestParam Long memberId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate
    ) {
        CalenderStudyRecordsResponse response = viewService.findStudyRecordsForCalender(
                memberId, startDate, endDate);
        return ResponseEntity.ok(response);
    }
}
