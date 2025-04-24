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
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/get-message-by-mid/{mid}")
    public Result getMessage(@PathVariable Long mid) {
        Message res = messageService.getMessageById(mid);
        if(res == null) return Result.error("留言不存在");
        return Result.success(res);
    }

    @GetMapping("/get-comment-by-cid/{cid}")
    public Result getComment(@PathVariable Long cid) {
        MessagesComment res = messagesCommentService.getMessagesCommentByCid(cid);
        if(res == null) return Result.error("留言不存在");
        return Result.success(res);
    }

    @GetMapping("/get-comments-by-mid/{mid}")
    public Result getCommentsByMid(@PathVariable Long mid) {
        List<MessagesComment> res = messagesCommentService.getAllMessagesCommentByMid(mid);
        return Result.success(res);
    }

    @PostMapping("/add-message")
    public Result addMessage(@RequestBody Message message) {
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

        return Result.success();
    }

    @PostMapping("/add-comment")
    public Result addComment(@RequestBody MessagesComment messagesComment) {
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
    public Result deleteMessage(@PathVariable Long mid) {
        if(messageService.getMessageById(mid) == null){
            return Result.error("留言不存在");
        }

        messagesCommentService.deleteMessagesCommentByMid(mid);
        messageService.deleteMessageByMid(mid);
        return Result.success();
    }

}
