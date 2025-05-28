package com.mythovac.backend.controller;

import com.mythovac.backend.entity.User;
import com.mythovac.backend.entity.Result;
import com.mythovac.backend.service.GoodsService;
import com.mythovac.backend.utils.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import com.mythovac.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
public class UserLoginController {

    @Autowired
    private UserService userService;
    @Autowired
    private GoodsService goodsService;
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

    @PostMapping("/api/TPregister")
    public Result register(@RequestBody User user) {
        log.info("用户注册: {}", user);

        // 检查手机号是否已存在
        if (userService.getUserByPhone(user.getPhone()) != null) {
            return Result.error("手机号已被注册");
        }

        // 对密码进行加密
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        // 保存用户信息
        userService.insertUser(user);

        return Result.success("注册成功");
    }

    @PostMapping("/api/TPchangePassword")
    public Result changePassword(@RequestBody User user) {
        log.info("用户修改密码: {}", user);

        // 检查用户是否存在
        User existingUser = userService.getUserByPhone(user.getPhone());
        if (existingUser == null) {
            return Result.error("用户不存在");
        }

        // 对新密码进行加密
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        existingUser.setPassword(encodedPassword);

        // 更新用户信息
        userService.updateUser(existingUser);

        return Result.success("密码修改成功");
    }

    @GetMapping("/api/TPgetGoodsByPhone/{phone}")
    public Result getGoodsByPhone(@PathVariable String phone) {
        log.info("获取用户商品信息: {}", phone);

        // 检查用户是否存在
        User user = userService.getUserByPhone(phone);
        if (user == null) {
            return Result.error("用户不存在");
        }

        // 获取用户的商品信息
        return Result.success(goodsService.getAllGoodsByPhone(phone));
    }
}