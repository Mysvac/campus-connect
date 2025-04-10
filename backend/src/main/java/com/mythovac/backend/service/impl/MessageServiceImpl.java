package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.Message;
import com.mythovac.backend.mapper.MessageMapper;
import com.mythovac.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageMapper messageMapper;

    @Override
    public List<Message> getAllMessages(){
        return messageMapper.getAllMessages();
    }

    @Override
    public Message getMessageById(Long messageId) {
        return messageMapper.getMessageById(messageId);
    }
    @Override
    public List<Message> getMessagesByTag(String tag){
        return messageMapper.getMessagesByTag(tag);
    }
    @Override
    public void insertMessage(Message message){
        messageMapper.insertMessage(message);
    }
    @Override
    public void updateMessage(Message message){
        messageMapper.updateMessage(message);
    }
    @Override
    public void deleteMessage(Message message){
        messageMapper.deleteMessage(message);
    }
}
