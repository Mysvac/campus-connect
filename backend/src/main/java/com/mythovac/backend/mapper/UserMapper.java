package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {
    @Select("SELECT * FROM users")
    List<User> getAllUsers();

    @Select("SELECT * FROM users WHERE uid = #{uid}")
    User getUserById(Long uid);

    @Select("SELECT * FROM users WHERE phone = #{phone}")
    User getUserByPhone(String phone);

    @Insert("INSERT INTO users(permission, phone, password, wallet, nickname, gender, email, profile, image)" +
            " VALUES(#{permission}, #{phone}, #{password}, #{wallet}, #{nickname}, #{gender}, #{email}, #{profile}, #{image})")
    @Options(useGeneratedKeys = true, keyProperty = "uid")
    void insertUser(User user);

    @Update("UPDATE users SET permission = #{permission}, phone = #{phone}," +
            " password = #{password}, wallet = #{wallet}, nickname = #{nickname}, " +
            " gender = #{gender}, email = #{email}, profile = #{profile}, " +
            " image = #{image} WHERE user_id = #{userId}")
    void updateUser(User user);

    @Delete("DELETE FROM users WHERE uid = #{uid}")
    void deleteUser(User user);
}
