package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.Score;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ScoreMapper {
    @Select("SELECT * FROM scores")
    List<Score> getAllScores();

    @Select("SELECT * FROM scores WHERE sid = #{sid}")
    Score getScoreBySid(Long sid);

    @Select("SELECT * FROM scores WHERE tag = #{tag}")
    List<Score> getScoresByTag(String tag);

    @Insert("INSERT INTO scores (tag, num, goal, intro, image, score)" +
            " VALUES (#{tag}, #{num}, #{goal}, #{intro}, #{image}, #{score})")
    @Options(useGeneratedKeys = true, keyProperty = "sid")
    void insertScore(Score t_score);

    @Update("UPDATE scores " +
            "SET tag = #{tag}, num = #{num}, goal = #{goal}, intro = #{intro}, image = #{image}, score = #{score} " +
            "WHERE sid = #{sid}")
    void updateScore(Score t_score);

    @Delete("DELETE FROM scores WHERE sid = #{sid}")
    void deleteScoreBySid(Long sid);

}
