package com.mythovac.backend.controller;

import com.mythovac.backend.entity.Result;
import com.mythovac.backend.entity.Task;
import com.mythovac.backend.service.*;
import org.springframework.web.bind.annotation.*;

@RestController("task-controller")
@RequestMapping("/api/task")
public class TaskController {

    private UserService userService;
    private TasksService tasksService;
    private TasksHandleService tasksHandleService;
    private TasksReleseService tasksReleseService;

    public TaskController(UserService userService, TasksService tasksService, TasksHandleService tasksHandleService, TasksReleseService tasksReleseService){
        this.userService = userService;
        this.tasksService = tasksService;
        this.tasksHandleService = tasksHandleService;
        this.tasksReleseService = tasksReleseService;
    }

    @GetMapping("/get-all-tasks")
    public Result getAllTasks()  {
        return Result.success(tasksService.getAllTasks());
    }

    @GetMapping("/get-tasks-by-tid/{tid}")
    public Result getTasksByTid(@PathVariable Long tid) {
        Task res = tasksService.getTaskById(tid);
        if(res == null){
            return Result.error("任务不存在");
        }
        return Result.success(res);
    }

    @GetMapping("/get-tasks-by-tag/{tag}")
    public Result getTasksByUid(@PathVariable String tag) {
        return Result.success(tasksService.getTasksByTag(tag));
    }

    @PostMapping("/add-task")
    public Result addTask(@RequestBody Task task) {
        if(task.getName() == null || task.getName().isEmpty()){
            return Result.error("任务名称不能为空");
        }
        if(task.getTag() == null || task.getTag().isEmpty()){
            return Result.error("任务标签不能为空");
        }
        if(task.getDetails() == null || task.getDetails().isEmpty()){
            return Result.error("任务描述不能为空");
        }
        tasksService.insertTask(task);
        return Result.success("添加成功");
    }

    @GetMapping("/delete-tasks-by-tid/{tid}")
    public Result deleteTasksByTid(@PathVariable Long tid) {
        Task res = tasksService.getTaskById(tid);
        if(res == null){
            return Result.error("任务不存在");
        }
        tasksService.deleteTask(tid);
        return Result.success("删除成功");
    }

}
