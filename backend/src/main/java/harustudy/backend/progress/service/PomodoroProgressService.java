package harustudy.backend.progress.service;

import harustudy.backend.member.domain.Member;
import harustudy.backend.member.exception.MemberNotFoundException;
import harustudy.backend.member.repository.MemberRepository;
import harustudy.backend.progress.domain.PomodoroProgress;
import harustudy.backend.progress.dto.PomodoroProgressResponse;
import harustudy.backend.progress.dto.RoomAndProgressStepResponse;
import harustudy.backend.progress.exception.InvalidPomodoroProgressException.UnavailableToProceed;
import harustudy.backend.progress.exception.PomodoroProgressNotFoundException;
import harustudy.backend.progress.repository.PomodoroProgressRepository;
import harustudy.backend.room.domain.PomodoroRoom;
import harustudy.backend.room.exception.RoomNotFoundException;
import harustudy.backend.room.repository.PomodoroRoomRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Transactional
@Deprecated
public class PomodoroProgressService {

    private final PomodoroProgressRepository pomodoroProgressRepository;
    private final PomodoroRoomRepository pomodoroRoomRepository;
    private final MemberRepository memberRepository;

    public RoomAndProgressStepResponse findMemberMetaData(Long studyId, Long memberId) {
        PomodoroRoom pomodoroRoom = pomodoroRoomRepository.findById(studyId).orElseThrow(IllegalArgumentException::new);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(IllegalArgumentException::new);

        PomodoroProgress pomodoroProgress = pomodoroProgressRepository.findByPomodoroRoomAndMember(
                        pomodoroRoom, member)
                .orElseThrow(IllegalArgumentException::new);

        return new RoomAndProgressStepResponse(pomodoroRoom.getName(), pomodoroRoom.getTotalCycle(),
                pomodoroProgress.getCurrentCycle(),
                pomodoroRoom.getTimePerCycle(), pomodoroProgress.getPomodoroStatus());
    }

    public void proceedToRetrospect(Long studyId, Long memberId) {
        PomodoroProgress pomodoroProgress = findPomodoroProgressFrom(studyId, memberId);
        validateProgressIsStudying(pomodoroProgress);
        pomodoroProgress.proceed();
    }

    private void validateProgressIsStudying(PomodoroProgress pomodoroProgress) {
        if (!pomodoroProgress.isStudying()) {
            throw new UnavailableToProceed();
        }
    }

    private PomodoroProgress findPomodoroProgressFrom(Long studyId, Long memberId) {
        PomodoroRoom pomodoroRoom = pomodoroRoomRepository.findById(studyId)
                .orElseThrow(RoomNotFoundException::new);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
        return pomodoroProgressRepository.findByPomodoroRoomAndMember(pomodoroRoom, member)
                .orElseThrow(PomodoroProgressNotFoundException::new);
    }

    public PomodoroProgressResponse findPomodoroProgress(Long roomId, Long memberId) {
        PomodoroRoom pomodoroRoom = pomodoroRoomRepository.findById(roomId)
                .orElseThrow(RoomNotFoundException::new);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
        PomodoroProgress pomodoroProgress = pomodoroProgressRepository.findByPomodoroRoomAndMember(pomodoroRoom, member)
                .orElseThrow(PomodoroProgressNotFoundException::new);
        return PomodoroProgressResponse.from(pomodoroProgress);
    }
}
