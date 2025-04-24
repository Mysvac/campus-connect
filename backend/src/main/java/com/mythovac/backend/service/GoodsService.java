package com.mythovac.backend.service;

import com.mythovac.backend.entity.Good;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface GoodsService {
    List<Good> getAllGoods();
    List<Good> getAllGoodsByTag(Integer tag);
    Good getGoodsById(Long gid);
    void insertGoods(Good goods);
    void updateGoods(Good goods);
    void deleteGoods(Long gid);
}
