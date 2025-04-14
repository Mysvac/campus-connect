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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @GetMapping("/get-message")
    public Result getMessage(Message message) {
        if(message == null || message.getMid() == null) {
            return Result.error("留言不存在");
        }
        Message res = messageService.getMessageById(message.getMid());
        if(res == null) return Result.error("留言不存在");
        return Result.success(res);
    }

    @GetMapping("/get-comment")
    public Result getComment(MessagesComment messagesComment) {
        if(messagesComment == null || messagesComment.getCid() == null) {
            return Result.error("留言不存在");
        }
        MessagesComment res = messagesCommentService.getMessagesCommentByCid(messagesComment.getCid());
        if(res == null) return Result.error("留言不存在");
        return Result.success(res);
    }

    @GetMapping("/get-comments-by-mid")
    public Result getCommentsByMid(Message message) {
        if(message == null || message.getMid() == null) {
            return Result.error("留言不存在");
        }
        if(messageService.getMessageById(message.getMid()) == null){
            return Result.error("留言不存在");
        }
        List<MessagesComment> res = messagesCommentService.getAllMessagesCommentByMid(message.getMid());
        return Result.success(res);
    }

    @PostMapping("/add-message")
    public Result addMessage(Message message) {
        if(message == null || message.getContent() == null || message.getContent().isEmpty()) {
            return Result.error("留言内容无效");
        }
        if(message.getUid() == null) {
            return Result.error("用户不存在");
        }
        if(userService.getUserById(message.getUid()) == null){
            return Result.error("用户不存在");
        }
        messageService.insertMessage(message);

        Message message1 = messageService.getMessageById(message.getMid());
        MessagesRelease messagesRelease = new MessagesRelease();
        messagesRelease.setMid(message1.getMid());
        messagesRelease.setUid(message1.getUid());
        messagesReleaseService.insertMessagesRelease(messagesRelease);
        return Result.success();
    }

    @PostMapping("/add-comment")
    public Result addComment(MessagesComment messagesComment) {
        if(messagesComment == null || messagesComment.getContent() == null || messagesComment.getContent().isEmpty()) {
            return Result.error("留言内容无效");
        }
        if(messagesComment.getUid() == null || messagesComment.getMid() == null) {
            return Result.error("目标不存在");
        }
        if(userService.getUserById(messagesComment.getUid()) == null){
            return Result.error("用户不存在");
        }
        if(messageService.getMessageById(messagesComment.getMid()) == null){
            return Result.error("留言不存在");
        }
        messagesCommentService.insertMessagesComment(messagesComment);
        return Result.success();
    }

    @GetMapping("/get-messages-by-uid")
    public Result getMessagesByUid(User user) {
        if(user == null || user.getUid() == null) {
            return Result.error("用户不存在");
        }
        if(userService.getUserById(user.getUid()) == null){
            return Result.error("用户不存在");
        }
        List<Message> res = messageService.getMessagesByUid(user.getUid());
        return Result.success(res);
    }

    @GetMapping("/get-messages-by-tag")
    public Result getMessagesByTag(Message message) {
        if(message == null || message.getTag() == null) {
            return Result.error("标签无效");
        }
        List<Message> res = messageService.getMessagesByTag(message.getTag());
        return Result.success(res);
    }

}
