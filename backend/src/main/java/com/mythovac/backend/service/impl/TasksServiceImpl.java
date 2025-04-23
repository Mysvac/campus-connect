package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.Task;
import com.mythovac.backend.mapper.TasksMapper;
import com.mythovac.backend.service.TasksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TasksServiceImpl implements TasksService {
    @Autowired
    private TasksMapper tasksMapper;

    @Override
    public List<Task> getAllTasks()
    {
        return tasksMapper.getAllTasks();
    }

    @Override
    public Task getTaskById(Long tid)
    {
        return tasksMapper.getTaskById(tid);
    }

    @Override
    public void insertTask(Task task)
    {
        tasksMapper.insertTask(task);
    }

    @Override
    public void updateTask(Task task)
    {
        tasksMapper.updateTask(task);
    }

    @Override
    public void deleteTask(Long tid)
    {
        tasksMapper.deleteTask(tid);
    }
}
