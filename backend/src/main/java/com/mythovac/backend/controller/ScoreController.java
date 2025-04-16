package com.mythovac.backend.controller;


import com.mythovac.backend.entity.Result;
import com.mythovac.backend.entity.Score;
import com.mythovac.backend.entity.ScoresComment;
import com.mythovac.backend.service.ScoreService;
import com.mythovac.backend.service.ScoresCommentService;
import com.mythovac.backend.service.ScoresReleaseService;
import com.mythovac.backend.service.UserService;
import com.mythovac.backend.service.impl.ScoreServiceImpl;
import com.mythovac.backend.service.impl.ScoresCommentServiceImpl;
import com.mythovac.backend.service.impl.ScoresReleaseServiceImpl;
import com.mythovac.backend.service.impl.UserServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("score-controller")
@RequestMapping("/api/score")
public class ScoreController {
    private UserService userService;
    private ScoreService scoreService;
    private ScoresCommentService scoresCommentService;
    private ScoresReleaseService scoresReleaseService;

    public ScoreController(UserServiceImpl userService, ScoreServiceImpl scoreService, ScoresReleaseServiceImpl scoresReleaseService, ScoresCommentServiceImpl scoresCommentService) {
        this.userService = userService;
        this.scoreService = scoreService;
        this.scoresCommentService = scoresCommentService;
        this.scoresReleaseService = scoresReleaseService;
    }

    @GetMapping("/get-score")
    public Result getScore(Score score) {
        if(score == null || score.getSid() == null) {
            return Result.error("评分不存在");
        }
        Score res = scoreService.getScoreBySid(score.getSid());
        if(res == null) return Result.error("评分不存在");
        return Result.success(res);
    }

    @GetMapping("/get-comments-by-sid")
    public Result getCommentsBySid(Score score) {
        if(score == null || score.getSid() == null) {
            return Result.error("评分不存在");
        }
        List<ScoresComment> res = scoresCommentService.getScoresCommentBySid(score.getSid());
        if(res == null) return Result.error("评分不存在");
        return Result.success(res);
    }

    @GetMapping("/get-score-by-tag")
    public Result getScoreByTag(Score score) {
        if(score == null || score.getTag() == null) {
            return Result.error("评分不存在");
        }
        List<Score> res = scoreService.getScoresByTag(score.getTag());
        if(res == null) return Result.error("评分不存在");
        return Result.success(res);
    }

    @PostMapping("/add-score")
    public Result addScore(Score score) {
        if(score == null || score.getTag() == null || score.getGoal() == null) {
            return Result.error("评分内容不符");
        }
        scoreService.insertScore(score);
        return Result.success();
    }


    @PostMapping("/add-comment")
    public Result addComment(ScoresComment scoresComment) {
        if(scoresComment == null || scoresComment.getSid() == null) {
            return Result.error("评分不存在");
        }
        if(scoresComment.getUid() == null) {
            return Result.error("用户不存在");
        }
        if(userService.getUserById(scoresComment.getUid()) == null){
            return Result.error("用户不存在");
        }
        if(scoreService.getScoreBySid(scoresComment.getSid()) == null){
            return Result.error("评分不存在");
        }
        scoresCommentService.insertScoresComment(scoresComment);
        return Result.success();
    }

    @PostMapping("/update-score")
    public Result updateScore(Score score) {
        if(score == null || score.getSid() == null) {
            return Result.error("评分不存在");
        }
        if(scoreService.getScoreBySid(score.getSid()) == null){
            return Result.error("评分不存在");
        }
        scoreService.updateScore(score);
        return Result.success();
    }

    @DeleteMapping("/delete-score")
    public Result deleteScore(Score score) {
        if(score == null || score.getSid() == null) {
            return Result.error("评分不存在");
        }
        if(scoreService.getScoreBySid(score.getSid()) == null){
            return Result.error("评分不存在");
        }
        scoreService.deleteScoreBySid(score.getSid());
        return Result.success();
    }

}
