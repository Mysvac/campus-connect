package com.mythovac.backend.service;

import com.mythovac.backend.entity.Good;

import java.util.List;

public interface GoodsService {
    List<Good> getAllGoods();
    List<Good> getAllGoodsByTag(String tag);
    List<Good> getAllGoodsByUid(Long uid);
    List<String> getAllTags();
    Good getGoodsById(Long gid);
    void insertGoods(Good goods);
    void updateGoods(Good goods);
    void deleteGoods(Long gid);
}
