package com.mythovac.backend.service;

import com.mythovac.backend.entity.MessagesComment;


import java.util.List;

public interface MessagesCommentService {
    List<MessagesComment> getAllMessagesComment();
    List<MessagesComment> getAllMessagesCommentByMid(Long mid);
    MessagesComment getMessagesCommentByCid(Long cid);
    void insertMessagesComment(MessagesComment messagesComment);
    void updateMessagesComment(MessagesComment messagesComment);
    void deleteMessagesComment(MessagesComment messagesComment);
}
