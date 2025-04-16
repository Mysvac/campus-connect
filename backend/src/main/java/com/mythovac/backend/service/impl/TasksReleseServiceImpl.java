package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.TasksRelease;
import com.mythovac.backend.mapper.TasksReleaseMapper;
import com.mythovac.backend.service.TasksReleseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TasksReleseServiceImpl implements TasksReleseService {
    private final TasksReleaseMapper tasksReleaseMapper;

    @Autowired
    public TasksReleseServiceImpl(TasksReleaseMapper tasksReleaseMapper) {
        this.tasksReleaseMapper = tasksReleaseMapper;
    }

    @Override
    public List<TasksRelease> getAllTasksRelease() {
        return tasksReleaseMapper.getAllTasksRelease();
    }

    @Override
    public TasksRelease getTasksReleaseById(Long tid, Long uid) {
        return tasksReleaseMapper.getTasksReleaseById(tid, uid);
    }

    @Override
    public void insertTasksRelease(TasksRelease tasksRelease) {
        tasksReleaseMapper.insertTasksRelease(tasksRelease);
    }

    @Override
    public void updateTasksRelease(TasksRelease tasksRelease) {
        tasksReleaseMapper.updateTasksRelease(tasksRelease);
    }

    @Override
    public void deleteTasksRelease(Long tid, Long uid) {
        tasksReleaseMapper.deleteTasksRelease(tid, uid);
    }
}
