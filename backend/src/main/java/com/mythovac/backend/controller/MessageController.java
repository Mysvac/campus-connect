package com.mythovac.backend.controller;

import com.mythovac.backend.entity.*;
import com.mythovac.backend.service.MessageService;
import com.mythovac.backend.service.MessagesCommentService;
import com.mythovac.backend.service.MessagesReleaseService;
import com.mythovac.backend.service.UserService;
import com.mythovac.backend.service.impl.MessageServiceImpl;
import com.mythovac.backend.service.impl.MessagesCommentServiceImpl;
import com.mythovac.backend.service.impl.MessagesReleaseServiceImpl;
import com.mythovac.backend.service.impl.UserServiceImpl;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

/**
 * 留言控制器
 * 处理留言相关的请求
 */
@RestController("message-controller")
@RequestMapping("/api/message")
public class MessageController {
    private final UserService userService;
    private final MessageService messageService;
    private final MessagesReleaseService messagesReleaseService;
    private final MessagesCommentService messagesCommentService;

    public MessageController(UserServiceImpl userService, MessageServiceImpl messageService, MessagesReleaseServiceImpl messagesReleaseService, MessagesCommentServiceImpl messagesCommentService) {
        this.userService = userService;
        this.messageService = messageService;
        this.messagesReleaseService = messagesReleaseService;
        this.messagesCommentService = messagesCommentService;
    }

    /**
     * 获取所有留言
     * @return 留言列表
     */
    @GetMapping("get-all-messages")
    public Result getMessages() {
        List<Message> res = messageService.getAllMessages();
        return res == null ? Result.error("留言不存在") : Result.success(res);
    }

    /**
     * 获取所有留言记录
     * @return 留言记录列表
     */
    @GetMapping("/get-message-by-mid/{mid}")
    public Result getMessageByMid(@PathVariable Long mid) {
        Message res = messageService.getMessageById(mid);
        return res == null ? Result.error("留言不存在") : Result.success(res);
    }

    /**
     * 获取指定留言评论记录
     * @return 单个评论
     */
    @GetMapping("/get-comment-by-cid/{cid}")
    public Result getComment(@PathVariable Long cid) {
        MessagesComment res = messagesCommentService.getMessagesCommentByCid(cid);
        return res == null ? Result.error("评论不存在") : Result.success(res);
    }

    /**
     * 获取指定留言的所有评论
     * @param mid 留言ID
     * @return 留言评论列表
     */
    @GetMapping("/get-comments-by-mid/{mid}")
    public Result getCommentsByMid(@PathVariable Long mid) {
        List<MessagesComment> res = messagesCommentService.getAllMessagesCommentByMid(mid);
        return Result.success(res);
    }

    /**
     * 添加留言
     * @param message 留言内容
     * @param session HTTP会话
     * @return 操作结果
     */
    @PostMapping("/add-message")
    public Result addMessage(@RequestBody Message message, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long) session.getAttribute("uid");
        message.setUid(uid);
        message.setTime(System.currentTimeMillis());
        messageService.insertMessage(message);

        return Result.success();
    }

    /**
     * 更新留言点赞数
     * 内部辅助函数
     * @param mid 留言id
     * @param delta 修改值
     * @return 操作结果
     */
    private Result updateMessagePraise(Long mid, int delta) {
        Message msg = messageService.getMessageById(mid);
        if (msg == null) return Result.error("留言不存在");
        msg.setPraise(msg.getPraise() + delta);
        messageService.updateMessage(msg);
        return Result.success();
    }

    /**
     * 更新评论点赞数
     * 内部辅助函数
     * @param cid 评论id
     * @param delta 修改值
     * @return 操作结果
     */
    private Result updateCommentPraise(Long cid, int delta) {
        MessagesComment mc = messagesCommentService.getMessagesCommentByCid(cid);
        if (mc == null) return Result.error("留言不存在");
        mc.setPraise(mc.getPraise() + delta);
        messagesCommentService.updateMessagesComment(mc);
        return Result.success();
    }

    /**
     * 点赞留言和评论
     * @param mid 留言ID
     * @return 操作结果
     */
    @PostMapping("/like-message/{mid}")
    public Result likeMessage(@PathVariable Long mid) {
        return updateMessagePraise(mid, 1);
    }
    /*
     * 取消点赞留言和评论
     * @param mid 留言ID
     * @return 操作结果
     */
    @PostMapping("/unlike-message/{mid}")
    public Result unlikeMessage(@PathVariable Long mid) {
        return updateMessagePraise(mid, -1);
    }

    /**
     * 点赞评论
     * @param cid 评论ID
     * @return 操作结果
     */
    @PostMapping("like-comment/{cid}")
    public Result likeComment(@PathVariable Long cid) {
        return updateCommentPraise(cid, 1);
    }
    /**
     * 取消点赞评论
     * @param cid 评论ID
     * @return 操作结果
     */
    @PostMapping("unlike-comment/{cid}")
    public Result unlikeComment(@PathVariable Long cid) {
        return updateCommentPraise(cid, -1);
    }

    /**
     * 添加评论到留言
     * @param messagesComment 评论内容
     * @param session HTTP会话
     * @return 操作结果
     */
    @PostMapping("/add-comment")
    public Result addComment(@RequestBody MessagesComment messagesComment, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        if (messagesComment == null || messagesComment.getContent() == null || messagesComment.getContent().isEmpty()) {
            return Result.error("留言内容无效");
        }
        if (messageService.getMessageById(messagesComment.getMid()) == null) {
            return Result.error("留言不存在");
        }
        if(messagesComment.getPraise() == null) messagesComment.setPraise(0);
        if(messagesComment.getTime() == null) messagesComment.setTime(System.currentTimeMillis());

        Long uid = (Long) session.getAttribute("uid");
        messagesComment.setUid(uid);
        messagesCommentService.insertMessagesComment(messagesComment);
        return Result.success();
    }

    /**
     * 获取指定用户的所有留言
     * @param uid 用户ID
     * @return 用户留言列表
     */
    @GetMapping("/get-messages-by-uid/{uid}")
    public Result getMessagesByUid(@PathVariable Long uid) {
        List<Message> res = messageService.getMessagesByUid(uid);
        return Result.success(res);
    }

    /**
     * 获取指定标签的所有留言
     * @param tag 标签名称
     * @return 标签留言列表
     */
    @GetMapping("/get-messages-by-tag/{tag}")
    public Result getMessagesByTag(@PathVariable String tag) {

        List<Message> res = messageService.getMessagesByTag(tag);
        return Result.success(res);
    }

    /**
     * 删除留言
     * @param mid 留言id
     * @param session HTTP会话
     * @return 操作结果
     */
    @DeleteMapping("/delete-message-by-mid/{mid}")
    public Result deleteMessage(@PathVariable Long mid, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long)(session.getAttribute("uid"));
        Integer permission = (Integer)(session.getAttribute("permission"));
        if (!Objects.equals(messageService.getMessageById(mid).getUid(), uid) && permission != 3) {
            return Result.error("用户不可用");
        }

        messagesCommentService.deleteMessagesCommentByMid(mid);
        messageService.deleteMessageByMid(mid);
        return Result.success();
    }

    /**
     * 删除评论
     * @param cid 评论id
     * @param session HTTP会话
     * @return 操作结果
     */
    @DeleteMapping("/delete-comment-by-cid/{cid}")
    public Result deleteComment(@PathVariable Long cid, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long)(session.getAttribute("uid"));
        Integer permission = (Integer)(session.getAttribute("permission"));
        MessagesComment mc = messagesCommentService.getMessagesCommentByCid(cid);
        if (mc == null) return Result.error("评论不存在");
        if (!Objects.equals(mc.getUid(), uid) && permission != 3) {
            return Result.error("用户不可用");
        }

        messagesCommentService.deleteMessagesCommentByCid(cid);
        return Result.success();
    }

}
