package com.mythovac.backend.mapper;

import com.mythovac.backend.entity.GoodsRelease;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface GoodsReleaseMapper {
    @Select("SELECT * FROM goods_release")
    List<GoodsRelease> getAllGoodsRelease();

    @Select("SELECT * FROM goods_release WHERE gid = #{gid} AND uid = #{uid}")
    GoodsRelease getGoodsReleaseById(Long gid, Long uid);

    @Insert("INSERT INTO goods_release (gid, uid) VALUES (#{gid}, #{uid})")
    void insertGoodsRelease(GoodsRelease goodsRelease);

    @Update("UPDATE goods_release SET gid = #{gid}, uid = #{uid} WHERE gid = #{gid} AND uid = #{uid}")
    void updateGoodsRelease(GoodsRelease goodsRelease);

    @Delete("DELETE FROM goods_release WHERE gid = #{gid} AND uid = #{uid}")
    void deleteGoodsRelease(Long gid, Long uid);
}
