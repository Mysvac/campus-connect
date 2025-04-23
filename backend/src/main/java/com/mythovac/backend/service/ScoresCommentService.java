package com.mythovac.backend.service;

import com.mythovac.backend.entity.ScoresComment;

import java.util.List;

public interface ScoresCommentService {
    List<ScoresComment> getScoresComment();
    List<ScoresComment> getScoresCommentBySid(Long sid);
    void insertScoresComment(ScoresComment scoresComment);
    void updateScoresComment(ScoresComment scoresComment);
    void deleteScoresCommentBySid(Long sid);
    void deleteScoresCommentBySidAndUid(Long sid, Long uid);
}
