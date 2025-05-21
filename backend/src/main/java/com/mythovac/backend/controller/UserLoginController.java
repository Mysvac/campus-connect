package com.mythovac.backend.controller;

import com.mythovac.backend.entity.User;
import com.mythovac.backend.entity.Result;
import com.mythovac.backend.utils.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import com.mythovac.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
public class UserLoginController {

    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/api/TPlogin")
    public Result login(@RequestBody User user){
        log.info("用户登录: {}", user);
        User user1 = userService.getUserByPhone(user.getPhone());
        if (user1 == null) {
            return Result.error("用户不存在");
        }

        //登录成功,生成令牌,下发令牌
        if (passwordEncoder.matches(user.getPassword(), user1.getPassword())){
            Map<String, Object> claims = new HashMap<>();
            claims.put("uid", user1.getUid());
            claims.put("phone", user1.getPhone());
            claims.put("nickname", user1.getNickname());

            String jwt = JwtUtils.generateJwt(claims); //jwt包含了当前登录的员工信息
            return Result.success(jwt);
        }

        //登录失败, 返回错误信息
        return Result.error("用户名或密码错误");
    }

}