package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.TasksHandle;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TasksHandleMapper {
    @Select("SELECT * FROM tasks_handle")
    List<TasksHandle> getAllTasksHandle();

    @Select("SELECT * FROM tasks_handle WHERE tid = #{tid} AND uid = #{uid}")
    TasksHandle getTasksHandleById(Long tid, Long uid);

    @Insert("INSERT INTO tasks_handle (tid, uid, status, notes, time) VALUES (#{tid}, #{uid}, #{status}, #{notes}, #{time})")
    void insertTasksHandle(TasksHandle tasksHandle);

    @Update("UPDATE tasks_handle SET tid = #{tid}, uid = #{uid}, status = #{status}, notes = #{notes}, time = #{time} " +
            "WHERE tid = #{tid} AND uid = #{uid}")
    void updateTasksHandle(TasksHandle tasksHandle);

    @Delete("DELETE FROM tasks_handle WHERE tid = #{tid} AND uid = #{uid}")
    void deleteTasksHandle(Long tid, Long uid);
}
