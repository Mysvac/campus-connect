package com.mythovac.backend.controller;

import com.mythovac.backend.entity.Result;
import com.mythovac.backend.entity.Task;
import com.mythovac.backend.entity.TasksHandle;
import com.mythovac.backend.service.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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

    @GetMapping("/get-tags")
    public Result getTags() {
        List<String> tags = tasksService.getAllTags();
        List<Map<String, Object>> result = new ArrayList<>();
        int id = 1;
        for (String tagName : tags) {
            Map<String, Object> tagMap = new HashMap<>();
            tagMap.put("id", id++);
            tagMap.put("name", tagName);
            result.add(tagMap);
        }
        return Result.success(result);
    }

    @PostMapping("/apply-task/{tid}")
    public Result applyTask(@PathVariable Long tid, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long) session.getAttribute("uid");
        Task task = tasksService.getTaskById(tid);
        if (task == null || task.getStatus() != 0) {
            return Result.error("任务不存在或不可用");
        }
        TasksHandle tasksHandle = new TasksHandle();
        tasksHandle.setUid(uid);
        tasksHandle.setStatus(3);
        tasksHandle.setTime(System.currentTimeMillis());
        tasksHandle.setTid(tid);
        tasksHandleService.insertTasksHandle(tasksHandle);
        return Result.success();
    }


    @PostMapping("/complete-task/{tid}")
    public Result completeTask(@PathVariable Long tid, HttpSession session)  {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long) session.getAttribute("uid");
        TasksHandle taskHandle = tasksHandleService.getTasksHandleById(tid, uid);
        if (taskHandle == null) {
            return Result.error("任务不存在");
        }
        taskHandle.setStatus(1);
        tasksHandleService.updateTasksHandle(taskHandle);
        Task task = tasksService.getTaskById(tid);
        task.setStatus(3);
        tasksService.updateTask(task);
        return Result.success();
    }

    @PostMapping("/terminate-task/{tid}")
    public Result terminateTask(@PathVariable Long tid, HttpSession session)  {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long) session.getAttribute("uid");
        TasksHandle taskHandle = tasksHandleService.getTasksHandleById(tid, uid);
        if (taskHandle == null) {
            return Result.error("任务不存在");
        }
        taskHandle.setStatus(2);
        tasksHandleService.updateTasksHandle(taskHandle);
        Task task = tasksService.getTaskById(tid);
        task.setStatus(0);
        tasksService.updateTask(task);
        return Result.success();
    }

    @PostMapping("/accept-applicant/{tid}/{uid}")
    public Result terminateTask(@PathVariable Long tid, @PathVariable Long uid, HttpSession session)  {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        TasksHandle taskHandle = tasksHandleService.getTasksHandleById(tid, uid);
        if (taskHandle == null) {
            return Result.error("任务不存在");
        }
        taskHandle.setStatus(0);
        tasksHandleService.updateTasksHandle(taskHandle);
        Task task = tasksService.getTaskById(tid);
        task.setStatus(1);
        tasksService.updateTask(task);
        return Result.success();
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
    public Result addTask(@RequestBody Task task, HttpSession session)  {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        if (task.getName() == null || task.getName().isEmpty()) {
            return Result.error("任务名称不能为空");
        }
        if (task.getTag() == null || task.getTag().isEmpty()) {
            return Result.error("任务标签不能为空");
        }
        if (task.getDetails() == null || task.getDetails().isEmpty()) {
            return Result.error("任务描述不能为空");
        }
        task.setUid((Long) session.getAttribute("uid"));
        tasksService.insertTask(task);
        return Result.success("添加成功");
    }

    @GetMapping("/delete-tasks-by-tid/{tid}")
    public Result deleteTasksByTid(@PathVariable Long tid, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long) session.getAttribute("uid");
        Integer permission = (Integer) session.getAttribute("permission");

        Task res = tasksService.getTaskById(tid);
        if (res == null) {
            return Result.error("任务不存在");
        }

        if (!Objects.equals(res.getUid(), uid) && permission != 3) {
            return Result.error("用户不可用");
        }

        tasksService.deleteTask(tid);
        return Result.success("删除成功");
    }

}
