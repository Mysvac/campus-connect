package com.mythovac.backend.service;

import com.mythovac.backend.entity.MessagesRelease;

import java.util.List;

public interface MessagesReleaseService {

    List<MessagesRelease> getAllMessagesRelease();
    List<MessagesRelease> getMessagesReleaseByUid(Long uid);
    void insertMessagesRelease(MessagesRelease messagesRelease);
    void deleteMessagesReleaseByMid(Long mid);
    void deleteMessagesReleaseByMidAndUid(Long mid, Long uid);
}
