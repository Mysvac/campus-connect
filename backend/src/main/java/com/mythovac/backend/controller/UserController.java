package com.mythovac.backend.controller;

import com.mythovac.backend.entity.Result;
import com.mythovac.backend.entity.User;
import com.mythovac.backend.service.UserService;
import com.mythovac.backend.service.impl.UserServiceImpl;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

/**
 * 用户控制器
 * 处理用户注册、登录、更新等请求
 */
@RestController("user-controller")
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    /**
     * 检查用户会话
     * 确保用户已登录且具有有效权限
     * @param session HttpSession
     * @return Result 如果未登录或权限不足，返回错误信息
     */
    public static Result checkSession(HttpSession session) {
        if (session.getAttribute("uid") == null) {
            return Result.error("请先登录");
        }
        Integer permission = (Integer) session.getAttribute("permission");
        if (permission == null || permission == 0) {
            return Result.error("用户不可用");
        }
        return null;
    }

    public UserController(UserServiceImpl userServiceImpl, PasswordEncoder passwordEncoder) {
        this.userService = userServiceImpl;
        this.passwordEncoder = passwordEncoder;
    }


    /**
     * 用户注册
     * @param user 用户信息
     * @param session HttpSession
     * @return Result 注册结果
     */
    @PostMapping("/register")
    public Result register(@RequestBody User user, HttpSession session) {
        String phone = user.getPhone();
        if(phone == null || phone.length() != 11) {
            return Result.error("手机号无效");
        }
        if(user.getPassword() == null || user.getPassword().length() < 6) {
            return Result.error("密码无效");
        }
        if(userService.getUserByPhone(user.getPhone()) == null){
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setWallet(0L);
            user.setGender(0);
            user.setEmail("");
            user.setPermission(1);
            user.setProfile("");
            userService.insertUser(user);
            User tUser = userService.getUserByPhone(phone);
            session.setAttribute("permission", tUser.getPermission());
            session.setAttribute("phone", tUser.getPhone());
            session.setAttribute("uid", tUser.getUid());
            return Result.success();
        } else {
            return Result.error("用户已存在");
        }
    }


    /**
     * 用户登录
     * @param user 用户信息
     * @param session HttpSession
     * @return Result 登录结果
     */
    @PostMapping("/login")
    public Result login(@RequestBody User user, HttpSession session) {
        User user1 = userService.getUserByPhone(user.getPhone());
        if (user1 == null) {
            return Result.error("用户不存在");
        }
        if (passwordEncoder.matches(user.getPassword(), user1.getPassword())) {
            user1.setPassword(null);
            session.setAttribute("permission", user1.getPermission());
            session.setAttribute("uid", user1.getUid());
            return Result.success(user1);
        } else {
            return Result.error("密码错误");
        }
    }

    /**
     * 充值
     * @param amount 充值金额
     * @param session HttpSession
     * @return Result 登出结果
     */
    @PostMapping("/recharge")
    public Result recharge(@RequestBody Long amount, HttpSession session) {
        if(session.getAttribute("uid") == null) {
            return Result.error("请先登录");
        }
        Long uid = (Long)(session.getAttribute("uid"));

        /*
        * TODO: 充值金额接口
        * */

        User user = userService.getUserById(uid);
        if (user == null) {
            return Result.error("用户不存在");
        }
        user.setWallet(user.getWallet() + amount);
        userService.updateUser(user);
        return Result.success(user);
    }

    /**
     * 获取用户名
     * @param uid 用户ID
     * @return Result 用户名
     */
    @GetMapping("/get-username/{uid}")
    public Result getUsername(@PathVariable Long uid) {
        User user = userService.getUserById(uid);
        if (user == null) {
            return Result.error("null");
        }
        return Result.success(user.getNickname());
    }

    /**
     * 获取用户名资料
     * @param uid 用户ID
     * @return Result 用户资料
     */
    @GetMapping("/get-user-data/{uid}")
    public Result getData(@PathVariable Long uid) {
        User user = userService.getUserById(uid);
        if (user == null) {
            return Result.error("null");
        }
        user.setPassword("");
        return Result.success(user);
    }

    /**
     * 用户更新
     * @param session HttpSession
     * @return Result 更新结果
     */
    @PostMapping("/update")
    public Result update(@RequestBody User user, HttpSession session) {
        if(session.getAttribute("uid") == null) {
            return Result.error("请先登录");
        }
        Long uid = (Long)(session.getAttribute("uid"));
        Integer permission = (Integer)(session.getAttribute("permission"));

        User oldUser = userService.getUserByPhone(user.getPhone());
        if (oldUser == null) return Result.error("用户不存在");

        if(!Objects.equals(user.getUid(), uid) && (permission == null || permission != 3)){
            return Result.error("权限不足");
        }
        if(user.getPermission() == null) user.setPermission( permission );
        if(permission != 3 && !Objects.equals(user.getPermission(), permission)) {
            return Result.error("你无法修改权限");
        }
        if( permission !=3 && !Objects.equals(user.getWallet(), oldUser.getWallet()) ) {
            return Result.error("你无法修改钱包余额");
        }

        if(user.getPhone() == null || user.getPhone().length() != 11) {
            return Result.error("手机号无效");
        }

        if( user.getPassword() == null ) {
            user.setPassword(oldUser.getPassword());
        } else if (user.getPassword().length() < 6) {
            return Result.error("密码无效");
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        if (user.getEmail() == null) user.setEmail(oldUser.getEmail());
        if (user.getNickname() == null) user.setNickname(oldUser.getNickname());
        if (user.getProfile() == null) user.setProfile(oldUser.getProfile());
        if (user.getImage() == null) user.setImage(oldUser.getImage());
        if (user.getGender() == null) user.setGender(oldUser.getGender());

        userService.updateUser(user);
        return Result.success(user);
    }

}
