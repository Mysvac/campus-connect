package com.mythovac.backend.service;

import com.mythovac.backend.entity.Message;

import java.util.List;

public interface MessageService {

    List<Message> getAllMessages();

    Message getMessageById(Long messageId);

    List<Message> getMessagesByTag(String tag);

    void insertMessage(Message message);

    void updateMessage(Message message);

    void deleteMessage(Message message);
}
