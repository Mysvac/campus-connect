package com.mythovac.backend.service;

import com.mythovac.backend.entity.Task;

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
