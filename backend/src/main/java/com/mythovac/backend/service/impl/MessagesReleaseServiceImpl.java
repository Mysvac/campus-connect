package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.MessagesRelease;
import com.mythovac.backend.mapper.MessagesReleaseMapper;
import com.mythovac.backend.service.MessagesReleaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessagesReleaseServiceImpl implements MessagesReleaseService {
    @Autowired
    private MessagesReleaseMapper messagesReleaseMapper;

    @Override
    public List<MessagesRelease> getAllMessagesRelease(){
        return messagesReleaseMapper.getAllMessagesRelease();
    }
    @Override
    public List<MessagesRelease> getMessagesReleaseByUid(Long uid){
        return messagesReleaseMapper.getMessagesReleaseByUid(uid);
    }
    @Override
    public void insertMessagesRelease(MessagesRelease messagesRelease){
        messagesReleaseMapper.insertMessagesRelease(messagesRelease);
    }
    @Override
    public void deleteMessagesReleaseByMid(Long mid){
        messagesReleaseMapper.deleteMessagesReleaseByMid(mid);
    }
    @Override
    public void deleteMessagesReleaseByMidAndUid(Long mid, Long uid){
        messagesReleaseMapper.deleteMessagesReleaseByMidAndUid(mid, uid);
    }
}
