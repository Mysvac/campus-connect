package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.Score;
import com.mythovac.backend.mapper.ScoreMapper;
import com.mythovac.backend.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoreServiceImpl implements ScoreService {
    @Autowired
    private ScoreMapper scoreMapper;

    @Override
    public List<Score> getAllScores(){
        return scoreMapper.getAllScores();
    }
    @Override
    public List<Score> getScoresBySid(Long sid){
        return scoreMapper.getScoresBySid(sid);
    }
    @Override
    public List<Score> getScoresByTag(String tag){
        return scoreMapper.getScoresByTag(tag);
    }
    @Override
    public void insertScore(Score t_score){
        scoreMapper.insertScore(t_score);
    }
    @Override
    public void updateScore(Score t_score){
        scoreMapper.updateScore(t_score);
    }
    @Override
    public void deleteScore(Score t_score){
        scoreMapper.deleteScore(t_score);
    }
}
