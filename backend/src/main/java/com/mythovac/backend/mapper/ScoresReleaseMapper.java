package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.ScoresRelease;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ScoresReleaseMapper {
    @Select("SELECT * FROM scores_release")
    List<ScoresRelease> getAllScoresRelease();

    @Select("SELECT * FROM scores_release WHERE uid = #{uid}")
    List<ScoresRelease> getScoresReleaseByUid(Long uid);

    @Select("SELECT * FROM scores_release WHERE sid = #{sid}")
    ScoresRelease getScoresReleaseBySid(Long sid);

    @Insert("INSERT INTO scores_release (sid, uid, time) VALUES (#{sid}, #{uid}, #{time})")
    void insertScoresRelease(ScoresRelease scoresRelease);

    @Delete("DELETE FROM scores_release WHERE sid = #{sid}")
    void deleteScoresReleaseBySid(Long sid);

}
