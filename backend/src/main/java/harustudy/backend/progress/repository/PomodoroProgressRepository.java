package harustudy.backend.progress.repository;

import harustudy.backend.member.domain.Member;
import harustudy.backend.progress.domain.PomodoroProgress;
import harustudy.backend.room.domain.PomodoroRoom;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PomodoroProgressRepository extends JpaRepository<PomodoroProgress, Long> {

    Optional<PomodoroProgress> findByPomodoroRoomAndMember(PomodoroRoom pomodoroRoom, Member member);

    List<PomodoroProgress> findAllByPomodoroRoom(PomodoroRoom pomodoroRoom);

    @Query("select p from PomodoroProgress p join fetch p.member")
    List<PomodoroProgress> findAllByPomodoroRoomFetchMember(PomodoroRoom pomodoroRoom);
}
