package com.mythovac.backend.controller;

import com.mythovac.backend.entity.Result;
import com.mythovac.backend.entity.User;
import com.mythovac.backend.service.UserService;
import com.mythovac.backend.service.impl.UserServiceImpl;
import jakarta.websocket.Session;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("user-controller")
@RequestMapping("/api/user")
public class UserController {
    private UserService userService;
    private PasswordEncoder passwordEncoder;

    public UserController(UserServiceImpl userServiceImpl, PasswordEncoder passwordEncoder) {
        userService = userServiceImpl;
        this.passwordEncoder = passwordEncoder;
    }


    @PostMapping("/register")
    public Result register(User user) {

        if(userService.getUserByPhone(user.getPhone()) == null){
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setWallet(0L);
            user.setGender(0);
            user.setEmail("");
            user.setPermission(1);
            user.setProfile("");
            userService.insertUser(user);
            return Result.success();
        } else {
            return Result.error("用户已存在");
        }

    }

    @PostMapping("/login")
    public Result login(User user) {
        User user1 = userService.getUserByPhone(user.getPhone());
        if (user1 == null) {
            return Result.error("用户不存在");
        }
        if (passwordEncoder.matches(user.getPassword(), user1.getPassword())) {
            user1.setPassword(null);
            return Result.success(user1);
        } else {
            return Result.error("密码错误");
        }
    }

}
