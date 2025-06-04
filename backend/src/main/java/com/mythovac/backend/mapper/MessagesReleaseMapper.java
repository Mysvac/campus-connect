package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.MessagesRelease;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MessagesReleaseMapper {
    @Select("SELECT * FROM messages_release")
    List<MessagesRelease> getAllMessagesRelease();

    @Select("SELECT * FROM messages_release WHERE uid = #{uid}")
    List<MessagesRelease> getMessagesReleaseByUid(Long uid);

    @Insert("INSERT INTO messages_release (mid, uid) " +
            "VALUES (#{mid}, #{uid})")
    void insertMessagesRelease(MessagesRelease messagesRelease);

    @Delete("DELETE FROM messages_release WHERE mid = #{mid}")
    void deleteMessagesReleaseByMid(Long mid);

    @Delete("DELETE FROM messages_release WHERE mid = #{mid} AND uid = #{uid}")
    void deleteMessagesReleaseByMidAndUid(Long mid, Long uid);
}
