package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.TasksRelease;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TasksReleaseMapper {
    @Select("SELECT * FROM tasks_release")
    List<TasksRelease> getAllTasksRelease();

    @Select("SELECT * FROM tasks_release WHERE tid = #{tid} AND uid = #{uid}")
    TasksRelease getTasksReleaseById(Long tid, Long uid);

    @Insert("INSERT INTO tasks_release (tid, uid) VALUES (#{tid}, #{uid})")
    void insertTasksRelease(TasksRelease goodsRelease);

    @Update("UPDATE tasks_release SET tid = #{tid}, uid = #{uid} WHERE tid = #{tid} AND uid = #{uid}")
    void updateTasksRelease(TasksRelease goodsRelease);

    @Delete("DELETE FROM tasks_release WHERE tid = #{tid} AND uid = #{uid}")
    void deleteTasksRelease(Long tid, Long uid);
}
