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
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

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

    @GetMapping("/get-score-by-sid/{sid}")
    public Result getScore(@PathVariable Long sid) {
        Score res = scoreService.getScoreBySid(sid);
        if(res == null) return Result.error("评分不存在");
        return Result.success(res);
    }

    @GetMapping("/get-comments-by-sid/{sid}")
    public Result getCommentsBySid(@PathVariable Long sid) {
        List<ScoresComment> res = scoresCommentService.getScoresCommentBySid(sid);
        if(res == null) return Result.error("评分不存在");
        return Result.success(res);
    }

    @GetMapping("/get-score-by-tag/{tag}")
    public Result getScoreByTag(@PathVariable String tag) {
        List<Score> res = scoreService.getScoresByTag(tag);
        if(res == null) return Result.error("评分不存在");
        return Result.success(res);
    }

    @PostMapping("/add-score")
    public Result addScore(@RequestBody Score score) {
        if(score == null || score.getTag() == null || score.getGoal() == null) {
            return Result.error("评分内容不符");
        }
        scoreService.insertScore(score);
        return Result.success();
    }


    @PostMapping("/add-comment")
    public Result addComment(@RequestBody ScoresComment scoresComment, HttpSession session) {
        if(session.getAttribute("uid") == null) {
            return Result.error("请先登录");
        }
        Long uid = (Long)(session.getAttribute("uid"));
        Long permission = (Long)(session.getAttribute("permission"));
        if(permission == null || permission == 0){
            return Result.error("用户不可用");
        }

        if(scoresComment == null || scoresComment.getSid() == null) {
            return Result.error("评分不存在");
        }
        if(scoreService.getScoreBySid(scoresComment.getSid()) == null){
            return Result.error("评分不存在");
        }
        scoresComment.setUid(uid);
        scoresCommentService.insertScoresComment(scoresComment);
        return Result.success();
    }

    @PostMapping("/update-score")
    public Result updateScore(@RequestBody Score score, HttpSession session) {
        if(session.getAttribute("uid") == null) {
            return Result.error("请先登录");
        }
        Long permission = (Long)(session.getAttribute("permission"));
        if(permission == null || permission != 0){
            return Result.error("用户不可用");
        }

        if(score == null || score.getSid() == null) {
            return Result.error("评分不存在");
        }
        if(scoreService.getScoreBySid(score.getSid()) == null){
            return Result.error("评分不存在");
        }
        scoreService.updateScore(score);
        return Result.success();
    }

    @DeleteMapping("/delete-score-by-sid/{sid}")
    public Result deleteScore(@PathVariable Long sid, HttpSession session) {
        if(session.getAttribute("uid") == null) {
            return Result.error("请先登录");
        }
        Long permission = (Long)(session.getAttribute("permission"));
        if(permission == null || permission != 0){
            return Result.error("用户不可用");
        }

        if(scoreService.getScoreBySid(sid) == null){
            return Result.error("评分不存在");
        }
        scoresCommentService.deleteScoresCommentBySid(sid);
        scoreService.deleteScoreBySid(sid);
        return Result.success();
    }


}
