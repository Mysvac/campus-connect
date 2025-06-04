package com.mythovac.backend.controller;


import com.mythovac.backend.entity.MessagesComment;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 评分相关的控制器
 * 提供获取评分、添加评分、更新评分、删除评分等功能
 */
@RestController("score-controller")
@RequestMapping("/api/score")
public class ScoreController {
    private final UserService userService;
    private final ScoreService scoreService;
    private final ScoresCommentService scoresCommentService;
    private final ScoresReleaseService scoresReleaseService;

    public ScoreController(UserServiceImpl userService, ScoreServiceImpl scoreService, ScoresReleaseServiceImpl scoresReleaseService, ScoresCommentServiceImpl scoresCommentService) {
        this.userService = userService;
        this.scoreService = scoreService;
        this.scoresCommentService = scoresCommentService;
        this.scoresReleaseService = scoresReleaseService;
    }

    /* * 获取所有评分
     * @return Result
     */
    @GetMapping("get-all-scores")
    public Result getAllScores() {
        List<Score> res = scoreService.getAllScores();
        return Result.success(res);
    }

    /**
     * 获取所有留言评论
     * @return 留言列表
     */
    @GetMapping("get-all-comments")
    public Result getAllComments() {
        List<ScoresComment> res = scoresCommentService.getScoresComment();
        return res == null ? Result.error("留言不存在") : Result.success(res);
    }

    /**
     * 获取所有通过审核的评分
     * @return Result
     */
    @GetMapping("get-all-avail-scores")
    public Result getAllAvailScores() {
        List<Score> res = scoreService.getAllAvailScores();
        return Result.success(res);
    }

    /**
     * 获取指定评分信息
     * @return Result
     */
    @GetMapping("/get-score-by-sid/{sid}")
    public Result getScore(@PathVariable Long sid) {
        Score res = scoreService.getScoreBySid(sid);
        return res == null ? Result.error("评分不存在") : Result.success(res);
    }

    /**
     * 获取指定评分的评价信息
     * @param sid 评分ID
     * @return Result
     */
    @GetMapping("/get-comments-by-sid/{sid}")
    public Result getCommentsBySid(@PathVariable Long sid) {
        List<ScoresComment> res = scoresCommentService.getScoresCommentBySid(sid);
        return Result.success(res);
    }

    /**
     * 获取指定类型的评分
     * @param tag 评分标签
     * @return Result
     */
    @GetMapping("/get-score-by-tag/{tag}")
    public Result getScoreByTag(@PathVariable String tag) {
        List<Score> res = scoreService.getScoresByTag(tag);
        return Result.success(res);
    }

    /**
     * 添加评分
     * @param score 评分
     * @return Result
     */
    @PostMapping("/add-score")
    public Result addScore(@RequestBody Score score) {
        if (score == null || score.getTag() == null || score.getGoal() == null) {
            return Result.error("评分内容不符");
        }
        score.setStatus(0L);
        if( score.getScore() == null) score.setScore(5.0);
        if( score.getNum() == null) score.setNum(0);

        scoreService.insertScore(score);
        return Result.success();
    }

    /**
     * 添加/更新评论，并修改评分分数
     * @param scoresComment 评分评论/评价
     * @return Result
     */
    @PostMapping("/add-comment")
    public Result addComment(@RequestBody ScoresComment scoresComment, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        if (scoresComment == null || scoresComment.getSid() == null) {
            return Result.error("评分不存在");
        }
        if (scoreService.getScoreBySid(scoresComment.getSid()) == null) {
            return Result.error("评分不存在");
        }
        if (scoresComment.getScore() == null) {
            return Result.error("评分分数不能为空");
        }

        scoresComment.setUid((Long) session.getAttribute("uid"));
        ScoresComment sc = scoresCommentService.getScoresCommentBySidAndUid(scoresComment.getSid(), scoresComment.getUid());
        if (sc == null) {
            scoresCommentService.insertScoresComment(scoresComment);
            Score score = scoreService.getScoreBySid(scoresComment.getSid());
            score.setNum(score.getNum() + 1);
            score.setScore((score.getScore() * (score.getNum() - 1) + scoresComment.getScore())/ (double) score.getNum());
            if(score.getScore() < 0.0) score.setScore(0.0);
            if(score.getScore() > 5.0) score.setScore(5.0);
            scoreService.updateScore(score);
        } else {
            scoresCommentService.updateScoresComment(scoresComment);
            Score score = scoreService.getScoreBySid(scoresComment.getSid());
            score.setScore((score.getScore() * score.getNum() - sc.getScore() + scoresComment.getScore())/ (double) score.getNum());
            if(score.getScore() < 0.0) score.setScore(0.0);
            if(score.getScore() > 5.0) score.setScore(5.0);
            scoreService.updateScore(score);
        }
        return Result.success();
    }

    /**
     * 获取某日自己的评分
     * @param uid 用户ID
     * @return Result
     */
    @GetMapping("/get-scores-comment-by-uid/{uid}")
    public Result getScoreCommentByUid(@PathVariable Long uid) {
        List<ScoresComment> res = scoresCommentService.getScoresCommentByUid(uid);
        if (res == null || res.isEmpty()) {
            return Result.error("没有找到评分评论");
        }
        return Result.success(res);
    }


    /**
     * 更新评分信息
     * @param score 评分信息
     * @return Result
     */
    @PostMapping("/update-score")
    public Result updateScore(@RequestBody Score score, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        if (score == null || score.getSid() == null) {
            return Result.error("评分不存在");
        }
        if (scoreService.getScoreBySid(score.getSid()) == null) {
            return Result.error("评分不存在");
        }
        scoreService.updateScore(score);
        return Result.success();
    }

    /**
     * 删除评分
     * 需要管理员权限
     * @param sid 评分ID
     * @param session HttpSession
     * @return Result
     */
    @DeleteMapping("/delete-score-by-sid/{sid}")
    public Result deleteScore(@PathVariable Long sid, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;
        if ((Integer) session.getAttribute("permission") != 3)
            return Result.error("权限不足");

        if (scoreService.getScoreBySid(sid) == null) {
            return Result.error("评分不存在");
        }
        scoresCommentService.deleteScoresCommentBySid(sid);
        scoreService.deleteScoreBySid(sid);
        return Result.success();
    }

}
