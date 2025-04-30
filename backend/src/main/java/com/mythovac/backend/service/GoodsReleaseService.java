package com.mythovac.backend.service;

import com.mythovac.backend.entity.GoodsRelease;

import java.util.List;

public interface GoodsReleaseService {
     List<GoodsRelease> getAllGoodsRelease();
     GoodsRelease getGoodsReleaseById(Long gid, Long uid);
     void insertGoodsRelease(GoodsRelease goodsRelease);
     void updateGoodsRelease(GoodsRelease goodsRelease);
     void deleteGoodsRelease(Long gid, Long uid);
}
