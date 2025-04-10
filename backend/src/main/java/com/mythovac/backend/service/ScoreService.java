package com.mythovac.backend.service;

import com.mythovac.backend.entity.Score;

import java.util.List;

public interface ScoreService {

    List<Score> getAllScores();
    List<Score> getScoresBySid(Long sid);
    List<Score> getScoresByTag(String tag);
    void insertScore(Score t_score);
    void updateScore(Score t_score);
    void deleteScore(Score t_score);
}
