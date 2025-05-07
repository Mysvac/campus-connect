package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.TasksHandle;
import com.mythovac.backend.mapper.TasksHandleMapper;
import com.mythovac.backend.service.TasksHandleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TasksHandleServiceImpl implements TasksHandleService {
    private final TasksHandleMapper tasksHandleMapper;

    @Autowired
    public TasksHandleServiceImpl(TasksHandleMapper tasksHandleMapper) {
        this.tasksHandleMapper = tasksHandleMapper;
    }

    @Override
    public List<TasksHandle> getAllTasksHandle() {
        return tasksHandleMapper.getAllTasksHandle();
    }

    @Override
    public TasksHandle getTasksHandleById(Long tid, Long uid){
        return tasksHandleMapper.getTasksHandleById(tid, uid);
    }

    @Override
    public void insertTasksHandle(TasksHandle tasksHandle) {
        tasksHandleMapper.insertTasksHandle(tasksHandle);
    }

    @Override
    public void updateTasksHandle(TasksHandle tasksHandle) {
        tasksHandleMapper.updateTasksHandle(tasksHandle);
    }

    @Override
    public void deleteTasksHandle(Long tid, Long uid) {
        tasksHandleMapper.deleteTasksHandle(tid, uid);
    }
}
