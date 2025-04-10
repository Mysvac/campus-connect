package com.mythovac.backend.service;

import com.mythovac.backend.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();
    User getUserById(Long uid);
    User getUserByPhone(String phone);
    void insertUser(User user);
    void updateUser(User user);
    void deleteUser(User user);
}
