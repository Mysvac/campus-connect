package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.Message;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MessageMapper {
    @Select("SELECT * FROM messages")
    List<Message> getAllMessages();

    @Select("SELECT * FROM messages WHERE mid = #{mid}")
    Message getMessageById(Long messageId);

    @Select("SELECT * FROM messages WHERE tag = #{tag}")
    List<Message> getMessagesByTag(String tag);

    @Select("SELECT * FROM messages WHERE uid = #{uid}")
    List<Message> getMessagesByUid(Long uid);

    @Insert("INSERT INTO messages(uid, content, title, praise, tag, time)" +
            " VALUES(#{uid}, #{content}, #{title}, #{praise}, #{tag}, #{time})")
    @Options(useGeneratedKeys = true, keyProperty = "mid")
    void insertMessage(Message message);

    @Update("UPDATE messages SET uid = #{uid}, content = #{content}, title = #{title}," +
            " praise = #{praise}, tag = #{tag}, time = #{time} WHERE mid = #{mid}")
    void updateMessage(Message message);

    @Delete("DELETE FROM messages WHERE mid = #{mid}")
    void deleteMessageByMid(Long mid);
}
