package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.GoodsRelease;
import com.mythovac.backend.mapper.GoodsReleaseMapper;
import com.mythovac.backend.service.GoodsReleaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoodsReleaseServiceImpl implements GoodsReleaseService {
    private final GoodsReleaseMapper goodsReleaseMapper;

    @Autowired
    public GoodsReleaseServiceImpl(GoodsReleaseMapper goodsReleaseMapper) {
        this.goodsReleaseMapper = goodsReleaseMapper;
    }

    @Override
    public List<GoodsRelease> getAllGoodsRelease() {
        return goodsReleaseMapper.getAllGoodsRelease();
    }

    @Override
    public GoodsRelease getGoodsReleaseById(Long gid, Long uid) {
        return goodsReleaseMapper.getGoodsReleaseById(gid, uid);
    }

    @Override
    public void insertGoodsRelease(GoodsRelease goodsRelease) {
        goodsReleaseMapper.insertGoodsRelease(goodsRelease);
    }

    @Override
    public void updateGoodsRelease(GoodsRelease goodsRelease) {
        goodsReleaseMapper.updateGoodsRelease(goodsRelease);
    }

    @Override
    public void deleteGoodsRelease(Long gid, Long uid) {
        goodsReleaseMapper.deleteGoodsRelease(gid, uid);
    }
}
