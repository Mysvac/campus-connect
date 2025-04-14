package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.MessagesComment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MessagesCommentMapper {
    @Select("SELECT * FROM messages_comment")
    List<MessagesComment> getAllMessagesComment();

    @Select("SELECT * FROM messages_comment WHERE mid = #{mid}")
    List<MessagesComment> getAllMessagesCommentByMid(Long mid);

    @Select("SELECT * FROM messages_comment WHERE cid = #{cid}")
    MessagesComment getMessagesCommentByCid(Long cid);

    @Insert("INSERT INTO messages_comment (mid, uid, content, praise, time) " +
            "VALUES (#{mid}, #{uid}, #{content}, #{createTime})")
    void insertMessagesComment(MessagesComment messagesComment);

    @Update("UPDATE messages_comment SET mid = #{mid}, uid = #{uid}, content = #{content}, " +
            "praise = #{praise}, time = #{time} WHERE cid = #{cid}")
    void updateMessagesComment(MessagesComment messagesComment);

    @Delete("DELETE FROM messages_comment WHERE cid = #{cid}")
    void deleteMessagesComment(MessagesComment messagesComment);
}
