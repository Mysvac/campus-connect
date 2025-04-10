package com.mythovac.backend.service;

import com.mythovac.backend.entity.ScoresComment;

import java.util.List;

public interface ScoresCommentService {
    List<ScoresComment> selectScoresComment();
    List<ScoresComment> selectScoresCommentBySid(Long sid);
    void insertScoresComment(ScoresComment scoresComment);
    void updateScoresComment(ScoresComment scoresComment);
    void deleteScoresComment(ScoresComment scoresComment);
}
