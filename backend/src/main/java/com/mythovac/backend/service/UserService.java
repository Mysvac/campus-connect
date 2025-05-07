package com.mythovac.backend.service;

import com.mythovac.backend.entity.User;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();
    User getUserById(Long uid);
    User getUserByPhone(String phone);
    void insertUser(User user);
    void updateUser(User user);
    void deleteUserByUid(Long uid);
}
