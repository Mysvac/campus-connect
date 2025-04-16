package com.mythovac.backend.service;

import com.mythovac.backend.entity.TasksRelease;

import java.util.List;

public interface TasksReleseService {
    List<TasksRelease> getAllTasksRelease();
    TasksRelease getTasksReleaseById(Long gid, Long uid);
    void insertTasksRelease(TasksRelease tasksRelease);
    void updateTasksRelease(TasksRelease tasksRelease);
    void deleteTasksRelease(Long gid, Long uid);
}
