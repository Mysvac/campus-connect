package com.mythovac.backend.service;

import com.mythovac.backend.entity.TasksHandle;

import java.util.List;

public interface TasksHandleService {
    List<TasksHandle> getAllTasksHandle();
    TasksHandle getTasksHandleById(Long tid, Long uid);
    void insertTasksHandle(TasksHandle tasksHandle);
    void updateTasksHandle(TasksHandle tasksHandle);
    void deleteTasksHandle(Long gid, Long uid);
}
