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

@RestController("message-controller")
@RequestMapping("/api/message")
public class MessageController {
    private UserService userService;
    private MessageService messageService;
    private MessagesReleaseService messagesReleaseService;
    private MessagesCommentService messagesCommentService;

    public MessageController(UserServiceImpl userService, MessageServiceImpl messageService, MessagesReleaseServiceImpl messagesReleaseService, MessagesCommentServiceImpl messagesCommentService) {
        this.userService = userService;
        this.messageService = messageService;
        this.messagesReleaseService = messagesReleaseService;
        this.messagesCommentService = messagesCommentService;
    }

    @GetMapping("get-all-messages")
    public Result getMessages() {
        List<Message> res = messageService.getAllMessages();
        return res == null ? Result.error("留言不存在") : Result.success(res);
    }

    @GetMapping("/get-message-by-mid/{mid}")
    public Result getMessageByMid(@PathVariable Long mid) {
        Message res = messageService.getMessageById(mid);
        return res == null ? Result.error("留言不存在") : Result.success(res);
    }

    @GetMapping("/get-comment-by-cid/{cid}")
    public Result getComment(@PathVariable Long cid) {
        MessagesComment res = messagesCommentService.getMessagesCommentByCid(cid);
        return res == null ? Result.error("留言不存在") : Result.success(res);
    }

    @GetMapping("/get-comments-by-mid/{mid}")
    public Result getCommentsByMid(@PathVariable Long mid) {
        List<MessagesComment> res = messagesCommentService.getAllMessagesCommentByMid(mid);
        return Result.success(res);
    }

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

    private Result updateMessagePraise(Long mid, int delta) {
        Message msg = messageService.getMessageById(mid);
        if (msg == null) return Result.error("留言不存在");
        msg.setPraise(msg.getPraise() + delta);
        messageService.updateMessage(msg);
        return Result.success();
    }

    private Result updateCommentPraise(Long cid, int delta) {
        MessagesComment mc = messagesCommentService.getMessagesCommentByCid(cid);
        if (mc == null) return Result.error("留言不存在");
        mc.setPraise(mc.getPraise() + delta);
        messagesCommentService.updateMessagesComment(mc);
        return Result.success();
    }

    @PostMapping("/like-message/{mid}")
    public Result likeMessage(@PathVariable Long mid) {
        return updateMessagePraise(mid, 1);
    }
    @PostMapping("/unlike-message/{mid}")
    public Result unlikeMessage(@PathVariable Long mid) {
        return updateMessagePraise(mid, -1);
    }

    @PostMapping("like-comment/{cid}")
    public Result likeComment(@PathVariable Long cid) {
        return updateCommentPraise(cid, 1);
    }
    @PostMapping("unlike-comment/{cid}")
    public Result unlikeComment(@PathVariable Long cid) {
        return updateCommentPraise(cid, -1);
    }

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

        Long uid = (Long) session.getAttribute("uid");
        messagesComment.setUid(uid);
        messagesCommentService.insertMessagesComment(messagesComment);
        return Result.success();
    }

    @GetMapping("/get-messages-by-uid/{uid}")
    public Result getMessagesByUid(@PathVariable Long uid) {
        List<Message> res = messageService.getMessagesByUid(uid);
        return Result.success(res);
    }

    @GetMapping("/get-messages-by-tag/{tag}")
    public Result getMessagesByTag(@PathVariable String tag) {

        List<Message> res = messageService.getMessagesByTag(tag);
        return Result.success(res);
    }

    @DeleteMapping("/delete-message-by-mid/{mid}")
    public Result deleteMessage(@PathVariable Long mid, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long)(session.getAttribute("uid"));
        Long permission = (Long)(session.getAttribute("permission"));
        if (!Objects.equals(messageService.getMessageById(mid).getUid(), uid) && permission != 3) {
            return Result.error("用户不可用");
        }

        messagesCommentService.deleteMessagesCommentByMid(mid);
        messageService.deleteMessageByMid(mid);
        return Result.success();
    }

}
