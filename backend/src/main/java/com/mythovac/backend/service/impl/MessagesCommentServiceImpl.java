package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.MessagesComment;
import com.mythovac.backend.mapper.MessagesCommentMapper;
import com.mythovac.backend.service.MessagesCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessagesCommentServiceImpl implements MessagesCommentService {
    @Autowired
    private MessagesCommentMapper messagesCommentMapper;

    @Override
    public List<MessagesComment> getAllMessagesComment(){
        return messagesCommentMapper.getAllMessagesComment();
    }
    @Override
    public List<MessagesComment> getAllMessagesCommentByMid(Long mid){
        return messagesCommentMapper.getAllMessagesCommentByMid(mid);
    }
    @Override
    public MessagesComment getMessagesCommentByCid(Long cid){
        return messagesCommentMapper.getMessagesCommentByCid(cid);
    }
    @Override
    public void insertMessagesComment(MessagesComment messagesComment){
        messagesCommentMapper.insertMessagesComment(messagesComment);
    }
    @Override
    public void updateMessagesComment(MessagesComment messagesComment){
        messagesCommentMapper.updateMessagesComment(messagesComment);
    }
    @Override
    public void deleteMessagesCommentByCid(Long cid){
        messagesCommentMapper.deleteMessagesCommentByCid(cid);
    }
    @Override
    public void deleteMessagesCommentByMid(Long mid){
        messagesCommentMapper.deleteMessagesCommentByMid(mid);
    }
}
