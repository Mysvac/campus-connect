package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.ScoresComment;
import com.mythovac.backend.mapper.ScoresCommentMapper;
import com.mythovac.backend.service.ScoresCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoresCommentServiceImpl implements ScoresCommentService {
    @Autowired
    private ScoresCommentMapper scoresCommentMapper;

    @Override
    public List<ScoresComment> selectScoresComment(){
        return scoresCommentMapper.selectScoresComment();
    }
    @Override
    public List<ScoresComment> selectScoresCommentBySid(Long sid){
        return scoresCommentMapper.selectScoresCommentBySid(sid);
    }
    @Override
    public void insertScoresComment(ScoresComment scoresComment){
        scoresCommentMapper.insertScoresComment(scoresComment);
    }
    @Override
    public void updateScoresComment(ScoresComment scoresComment){
        scoresCommentMapper.updateScoresComment(scoresComment);
    }
    @Override
    public void deleteScoresComment(ScoresComment scoresComment){
        scoresCommentMapper.deleteScoresComment(scoresComment);
    }
}
