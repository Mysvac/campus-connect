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
    public List<ScoresComment> getScoresComment(){
        return scoresCommentMapper.getScoresComment();
    }
    @Override
    public List<ScoresComment> getScoresCommentBySid(Long sid){
        return scoresCommentMapper.getScoresCommentBySid(sid);
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
    public void deleteScoresCommentBySidAndUid(Long sid, Long uid){
        scoresCommentMapper.deleteScoresCommentBySidAndUid(sid, uid);
    }
}
