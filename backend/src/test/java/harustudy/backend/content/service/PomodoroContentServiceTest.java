package harustudy.backend.content.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import harustudy.backend.content.controller.domain.PomodoroContent;
import harustudy.backend.content.dto.PomodoroContentResponse;
import harustudy.backend.content.dto.PomodoroContentsResponse;
import harustudy.backend.member.domain.Member;
import harustudy.backend.participantcode.domain.CodeGenerationStrategy;
import harustudy.backend.participantcode.domain.ParticipantCode;
import harustudy.backend.progress.domain.PomodoroProgress;
import harustudy.backend.progress.domain.PomodoroStatus;
import harustudy.backend.progress.exception.StudyPomodoroProgressException;
import harustudy.backend.room.domain.PomodoroRoom;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator.ReplaceUnderscores;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SuppressWarnings("NonAsciiCharacters")
@DisplayNameGeneration(ReplaceUnderscores.class)
@DataJpaTest(includeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = PomodoroContentService.class))
class PomodoroContentServiceTest {

    @Autowired
    private TestEntityManager testEntityManager;
    @Autowired
    private PomodoroContentService pomodoroContentService;

    @Test
    void 계획_단계가_아닐_때_계획을_작성하려_하면_예외를_던진다() {
        // given
        ParticipantCode participantCode = new ParticipantCode(new CodeGenerationStrategy());
        PomodoroRoom pomodoroRoom = new PomodoroRoom("roomName", 1, 20, participantCode);
        Member member = new Member("nickname");
        PomodoroProgress pomodoroProgress = new PomodoroProgress(pomodoroRoom, member, 1,
                PomodoroStatus.RETROSPECT);
        PomodoroContent pomodoroRecord = new PomodoroContent(pomodoroProgress, 1, Map.of(),
                Map.of());

        // when
        testEntityManager.persist(participantCode);
        testEntityManager.persist(pomodoroRoom);
        testEntityManager.persist(member);
        testEntityManager.persist(pomodoroProgress);
        testEntityManager.persist(pomodoroRecord);

        // then
        assertThatThrownBy(() -> pomodoroContentService.writePlan(pomodoroRoom.getId(),
                member.getId(), Map.of("plan", "abc")))
                .isInstanceOf(StudyPomodoroProgressException.class);
    }


    @Test
    void 계획이_작성되어_있지_않은_경우_회고를_작성하려_하면_예외를_던진다() {
        // given
        ParticipantCode participantCode = new ParticipantCode(new CodeGenerationStrategy());
        PomodoroRoom pomodoroRoom = new PomodoroRoom("roomName", 1, 20, participantCode);
        Member member = new Member("nickname");
        PomodoroProgress pomodoroProgress = new PomodoroProgress(pomodoroRoom, member, 1,
                PomodoroStatus.RETROSPECT);
        PomodoroContent pomodoroRecord = new PomodoroContent(pomodoroProgress, 1, Map.of(), Map.of());

        // when
        testEntityManager.persist(participantCode);
        testEntityManager.persist(pomodoroRoom);
        testEntityManager.persist(member);
        testEntityManager.persist(pomodoroProgress);
        testEntityManager.persist(pomodoroRecord);

        // then
        assertThatThrownBy(() -> pomodoroContentService.writeRetrospect(pomodoroRoom.getId(),
                member.getId(), Map.of("retrospect", "abc")))
                .isInstanceOf(StudyPomodoroProgressException.class);
    }


    @Test
    void 스터디에_참여한_특정_스터디원의_콘텐츠를_조회한다() {
        // given
        Map<String, String> expectedPlan = Map.of(
                "toDo", "쿠키와 세션",
                "completionCondition", "완료조건",
                "expectedProbability", "80%",
                "expectedDifficulty", "예상되는 어려움",
                "whatCanYouDo", "가능성을 높이기 위해 무엇을 할 수 있을지?");

        Map<String, String> expectedRetrospect = Map.of(
                "doneAsExpected", "예상했던 결과",
                "experiencedDifficulty", "겪었던 어려움",
                "lesson", "교훈");

        ParticipantCode participantCode = new ParticipantCode(new CodeGenerationStrategy());
        PomodoroRoom pomodoroRoom = new PomodoroRoom("roomName", 1, 20, participantCode);
        Member member = new Member("nickname");
        PomodoroProgress pomodoroProgress = new PomodoroProgress(pomodoroRoom, member, 1, PomodoroStatus.RETROSPECT);
        PomodoroContent pomodoroContent = new PomodoroContent(pomodoroProgress, 1, expectedPlan, expectedRetrospect);

        // when
        testEntityManager.persist(participantCode);
        testEntityManager.persist(pomodoroRoom);
        testEntityManager.persist(member);
        testEntityManager.persist(pomodoroProgress);
        testEntityManager.persist(pomodoroContent);

        testEntityManager.flush();
        testEntityManager.clear();

        PomodoroContentsResponse pomodoroContentsResponse = pomodoroContentService.findMemberContent(pomodoroRoom.getId(), member.getId());

        PomodoroContentResponse expectedPomodoroContentResponse = new PomodoroContentResponse(1, expectedPlan,
                expectedRetrospect);

        // when
        List<PomodoroContentResponse> content = pomodoroContentsResponse.content();

        // then
        assertThat(content).containsExactly(expectedPomodoroContentResponse);
    }

    @Test
    void 스터디에_참여한_특정_스터디원의_콘텐츠를_조회시_스터디가_없으면_예외를_던진다() {
        // given & when & then
        assertThatThrownBy(() -> pomodoroContentService.findMemberContent(10L, 1L))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void 스터디에_참여한_특정_스터디원의_콘텐츠를_조회_시_멤버가_없으면_예외를_던진다() {
        // given & when & then
        assertThatThrownBy(() -> pomodoroContentService.findMemberContent(1L, 10L))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
