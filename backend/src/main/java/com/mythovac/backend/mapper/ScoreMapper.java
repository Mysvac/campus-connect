package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.Score;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ScoreMapper {
    @Select("SELECT * FROM scores ORDER BY time DESC")
    List<Score> getAllScores();

    @Select("SELECT * FROM scores WHERE status = 1 ORDER BY time DESC")
    List<Score> getAllAvailScores();

    @Select("SELECT * FROM scores WHERE sid = #{sid}")
    Score getScoreBySid(Long sid);

    @Select("SELECT * FROM scores WHERE tag = #{tag} AND status = 1")
    List<Score> getScoresByTag(String tag);

    @Insert("INSERT INTO scores (status, tag, num, goal, intro, image, score)" +
            " VALUES (#{status}, #{tag}, #{num}, #{goal}, #{intro}, #{image}, #{score})")
    @Options(useGeneratedKeys = true, keyProperty = "sid")
    void insertScore(Score t_score);

    @Update("UPDATE scores " +
            "SET status = #{status}, tag = #{tag}, num = #{num}, goal = #{goal}, intro = #{intro}, image = #{image}, score = #{score} " +
            "WHERE sid = #{sid}")
    void updateScore(Score t_score);

    @Delete("DELETE FROM scores WHERE sid = #{sid}")
    void deleteScoreBySid(Long sid);

}
