package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.Task;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TasksMapper {
    @Select("SELECT * FROM tasks")
    List<Task> getAllTasks();

    @Select("SELECT * FROM tasks WHERE tid = #{tid}")
    Task getTaskById(Long tid);

    @Insert("INSERT INTO tasks (tid, uid, money, name, contact, details, status, tag, time) VALUES (#{tid}, #{uid}, #{money}, #{name}, #{contact}, #{details}, #{status}, #{tag}, #{time})")
    void insertTask(Task task);

    @Update("UPDATE tasks SET uid = #{uid}, money = #{money}, name = #{name}, contact = #{contact}, details = #{details}, status = #{status}, tag = #{tag}, time = #{time} WHERE tid = #{tid}")
    void updateTask(Task task);

    @Delete("DELETE FROM tasks WHERE tid = #{tid}")
    void deleteTask(Long tid);
}
