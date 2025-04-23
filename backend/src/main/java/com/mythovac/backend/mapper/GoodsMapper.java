package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.Good;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface GoodsMapper {
    @Select("SELECT * FROM goods")
    List<Good> getAllGoods();

    @Select("SELECT * FROM goods WHERE gid = #{gid}")
    Good getGoodsById(Long gid);

    @Insert("INSERT INTO goods (gid, uid, price, name, image, tag, intro, quantity, sales, time) VALUES (#{gid}, #{uid}, #{price}, #{name}, #{image}, #{tag}, #{intro}, #{quantity}, #{sales}, #{time})")
    void insertGoods(Good goods);

    @Update("UPDATE goods SET uid = #{uid}, price = #{price}, name = #{name}, image = #{image}, tag = #{tag}, intro = #{intro}, quantity = #{quantity}, sales = #{sales}, time = #{time} WHERE gid = #{gid}")
    void updateGoods(Good goods);

    @Delete("DELETE FROM goods WHERE gid = #{gid}")
    void deleteGoods(Long gid);
}
