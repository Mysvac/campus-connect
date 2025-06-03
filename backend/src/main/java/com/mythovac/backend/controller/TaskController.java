package com.mythovac.backend.controller;

import com.mythovac.backend.entity.Result;
import com.mythovac.backend.entity.Task;
import com.mythovac.backend.entity.TasksHandle;
import com.mythovac.backend.entity.User;
import com.mythovac.backend.service.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 处理任务相关内容
 */
@RestController("task-controller")
@RequestMapping("/api/task")
public class TaskController {

    private final UserService userService;
    private final TasksService tasksService;
    private final TasksHandleService tasksHandleService;
    private final TasksReleseService tasksReleseService;

    public TaskController(UserService userService, TasksService tasksService, TasksHandleService tasksHandleService, TasksReleseService tasksReleseService){
        this.userService = userService;
        this.tasksService = tasksService;
        this.tasksHandleService = tasksHandleService;
        this.tasksReleseService = tasksReleseService;
    }

    /**
     * 获取所有任务
     * @return 任务列表
     */
    @GetMapping("/get-all-tasks")
    public Result getAllTasks()  {
        return Result.success(tasksService.getAllTasks());
    }

    /**
     * 获取所有可能的标签
     * @return 用户任务列表
     */
    @GetMapping("/get-tags")
    public Result getTags() {
        return Result.success(tasksService.getAllTags());
    }

    /*
      任务Task：
      0.待接取 1.进行中 2.终止 3.完成

      任务处理:TaskHandle:
      0.待同意 1.进行中 2.终止 3.完成
     */

    /**
     * 领取任务
     * @param tid 任务ID
     * @param session HttpSession
     * @return 用户任务列表
     */
    @PostMapping("/apply-task/{tid}")
    public Result applyTask(@PathVariable Long tid, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long) session.getAttribute("uid");
        Task task = tasksService.getTaskById(tid);
        if (task == null || task.getStatus() != 0) {
            return Result.error("任务不存在或不可用");
        }
        if (tasksHandleService.getTasksHandleById(tid, uid) != null) {
            return Result.error("请勿重复申请任务");
        }

        TasksHandle tasksHandle = new TasksHandle();
        tasksHandle.setUid(uid);
        tasksHandle.setStatus(1);
        tasksHandle.setTime(System.currentTimeMillis());
        tasksHandle.setTid(tid);
        tasksHandleService.insertTasksHandle(tasksHandle);
        task.setStatus(1);
        tasksService.updateTask(task);
        return Result.success();
    }

    /**
     * 完成任务
     * @param tid 任务ID
     * @param session HttpSession
     * @return 用户任务列表
     */
    @PostMapping("/complete-task/{tid}/{uid}")
    public Result completeTask(@PathVariable Long tid, @PathVariable Long uid, HttpSession session)  {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        TasksHandle taskHandle = tasksHandleService.getTasksHandleById(tid, uid);
        if (taskHandle == null) {
            return Result.error("任务不存在");
        }
        // 终止其他任务处理
        List<TasksHandle> handles =  tasksHandleService.getAllTasksHandleByTid(tid);
        if (!handles.isEmpty()) {
            for( TasksHandle handle : handles ) {
                handle.setStatus(2);
                tasksHandleService.updateTasksHandle(handle);
            }
        }
        // 完成当前任务处理
        taskHandle.setStatus(3);
        tasksHandleService.updateTasksHandle(taskHandle);
        // 完成任务
        Task task = tasksService.getTaskById(tid);
        task.setStatus(3);
        tasksService.updateTask(task);
        return Result.success();
    }

    /**
     * 取消任务
     * @param tid 任务ID
     * @param session HttpSession
     * @return 用户任务列表
     */
    @PostMapping("/terminate-task/{tid}")
    public Result terminateTask(@PathVariable Long tid, HttpSession session)  {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long) session.getAttribute("uid");
        Task task = tasksService.getTaskById(tid);
        if( task == null ) {
            return Result.error("任务不存在");
        }
        if( !Objects.equals(uid, task.getUid()) && (Integer) session.getAttribute("permission") != 3 ) {
            return Result.error("权限不足");
        }

        task.setStatus(2);
        tasksService.updateTask(task);
        List<TasksHandle> handles =  tasksHandleService.getAllTasksHandleByTid(tid);
        if (!handles.isEmpty()) {
            for( TasksHandle handle : handles ) {
                handle.setStatus(2);
                tasksHandleService.updateTasksHandle(handle);
            }
        }
        return Result.success();
    }

    /**
     * 取消自己的单个任务处理
     * @param tid 任务ID
     * @param session HttpSession
     * @return 用户任务列表
     */
    @PostMapping("/terminate-taskhandle/{tid}/{uid}")
    public Result terminateTaskHandle(@PathVariable Long tid, @PathVariable Long uid, HttpSession session)  {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Task task = tasksService.getTaskById(tid);

        if (task == null) {
            return Result.error("任务不存在");
        }
        if(
                !Objects.equals(uid, task.getUid()) &&
               (Integer) session.getAttribute("permission") != 3
        ) {
            return Result.error("权限不足");
        }
        var taskHandle = tasksHandleService.getTasksHandleById(tid, uid);
        taskHandle.setStatus(2);
        tasksHandleService.updateTasksHandle(taskHandle);
        task.setStatus(0);
        tasksService.updateTask(task);
        return Result.success();
    }

//    /**
//     * 同意任务的申请
//     * @param session HttpSession
//     * @return 用户任务列表
//     */
//    @PostMapping("/accept-applicant/{tid}/{uid}")
//    public Result terminateTask(@PathVariable Long tid, @PathVariable Long uid, HttpSession session)  {
//        Result sessionCheck = UserController.checkSession(session);
//        if (sessionCheck != null) return sessionCheck;
//
//        TasksHandle taskHandle = tasksHandleService.getTasksHandleById(tid, uid);
//        if (taskHandle == null) {
//            return Result.error("任务不存在");
//        }
//        taskHandle.setStatus(1);
//        tasksHandleService.updateTasksHandle(taskHandle);
//        Task task = tasksService.getTaskById(tid);
//        task.setStatus(1); //
//        tasksService.updateTask(task);
//        return Result.success();
//    }

    /**
     * 获取当前任务的被申请情况
     * 以便发布人同意处理请求
     * @param tid 任务ID
     * @return 用户任务列表
     */
    @GetMapping("/get-taskshandle-by-tid/{tid}")
    public Result getTasksHandleByTid(@PathVariable Long tid) {
        List<TasksHandle> res = tasksHandleService.getAllTasksHandleByTid(tid);
        if(res == null){
            return Result.error("任务不存在或没有申请记录");
        }
        return Result.success(res);
    }

    /**
     * 获取指定任务信息
     * @param tid 任务ID
     * @return 用户任务列表
     */
    @GetMapping("/get-tasks-by-tid/{tid}")
    public Result getTasksByTid(@PathVariable Long tid) {
        Task res = tasksService.getTaskById(tid);
        if(res == null){
            return Result.error("任务不存在");
        }
        return Result.success(res);
    }

    /**
     * 获取指定tag的任务列表
     * @param tag tag
     * @return 用户任务列表
     */
    @GetMapping("/get-tasks-by-tag/{tag}")
    public Result getTasksByUid(@PathVariable String tag) {
        return Result.success(tasksService.getTasksByTag(tag));
    }

    /**
     * 获取指定用户发布的任务列表
     * @param uid uid
     * @return 用户任务列表
     */
    @GetMapping("/get-tasks-by-uid/{uid}")
    public Result getTasksByUid(@PathVariable Long uid) {
        return Result.success(tasksService.getTasksByUid(uid));
    }

    /**
     * 获取指定用户领取的任务列表
     * @param uid uid
     * @return 用户任务列表
     */
    @GetMapping("/get-taskshandle-by-uid/{uid}")
    public Result getTasksHandleByUid(@PathVariable Long uid) {
        List<TasksHandle> res = tasksHandleService.getAllTasksHandleByUid(uid);
        if(res == null){
            return Result.error("任务不存在或用户没有领取申请记录");
        }
        return Result.success(res);
    }

    /**
     * 添加任务
     * @param task 任务
     * @return 用户任务列表
     */
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
        User usr = userService.getUserById(task.getUid());
        if(usr.getWallet() < task.getMoney()){
            return Result.error("钱包余额不足，无法发布任务");
        }
        usr.setWallet(usr.getWallet() - task.getMoney());
        userService.updateUser(usr);
        task.setStatus(2); // 默认状态为未开始
        tasksService.insertTask(task);
        return Result.success("添加成功");
    }

    /**
     * 删除任务
     * @param tid tid
     * @return 用户任务列表
     */
    @DeleteMapping("/delete-tasks-by-tid/{tid}")
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
