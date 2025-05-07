package com.mythovac.backend.service;

import com.mythovac.backend.entity.Task;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface TasksService {
    List<Task> getAllTasks();
    List<String> getAllTags();
    Task getTaskById(Long tid);
    List<Task> getTasksByTag(String tag);
    void insertTask(Task task);
    void updateTask(Task task);
    void deleteTask(Long tid);
}
