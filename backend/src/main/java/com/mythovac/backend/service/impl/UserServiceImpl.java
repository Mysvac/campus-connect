package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.User;
import com.mythovac.backend.mapper.UserMapper;
import com.mythovac.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<User> getAllUsers(){
        return userMapper.getAllUsers();
    }
    @Override
    public User getUserById(Long uid){
        return userMapper.getUserById(uid);
    }
    @Override
    public User getUserByPhone(String phone){
        return userMapper.getUserByPhone(phone);
    }
    @Override
    public void insertUser(User user){
        userMapper.insertUser(user);
    }
    @Override
    public void updateUser(User user){
        userMapper.updateUser(user);
    }
    @Override
    public void deleteUserByUid(Long uid){
        userMapper.deleteUserByUid(uid);
    }
}
