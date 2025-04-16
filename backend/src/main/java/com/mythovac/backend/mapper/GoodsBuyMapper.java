package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.GoodsBuy;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface GoodsBuyMapper {
    @Select("SELECT * FROM goods_buy")
    List<GoodsBuy> getAllGoodsBuy();

    @Select("SELECT * FROM goods_buy WHERE oid = #{oid}")
    GoodsBuy getGoodsBuyById(Long oid);

    @Insert("INSERT INTO goods_buy (gid, uid, time, sum, number, status, notes) " +
            "VALUES (#{gid}, #{uid}, #{time}, #{sum}, #{number}, #{status}, #{notes})")
    @Options(useGeneratedKeys = true, keyProperty = "oid")
    void insertGoodsBuy(GoodsBuy goodsBuy);

    @Update("UPDATE goods_buy SET gid = #{gid}, uid = #{uid}, time = #{time}, sum = #{sum}, " +
            "number = #{number}, status = #{status}, notes = #{notes} WHERE oid = #{oid}")
    void updateGoodsBuy(GoodsBuy goodsBuy);

    @Delete("DELETE FROM goods_buy WHERE oid = #{oid}")
    void deleteGoodsBuy(Long oid);
}
