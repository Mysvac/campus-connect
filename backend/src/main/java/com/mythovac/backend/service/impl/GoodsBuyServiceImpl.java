package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.GoodsBuy;
import com.mythovac.backend.mapper.GoodsBuyMapper;
import com.mythovac.backend.service.GoodsBuyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoodsBuyServiceImpl implements GoodsBuyService {
    private final GoodsBuyMapper goodsBuyMapper;

    @Autowired
    public GoodsBuyServiceImpl(GoodsBuyMapper goodsBuyMapper) {
        this.goodsBuyMapper = goodsBuyMapper;
    }

    @Override
    public List<GoodsBuy> getAllGoodsBuy() {
        return goodsBuyMapper.getAllGoodsBuy();
    }

    @Override
    public List<GoodsBuy> getGoodsBuyByUid(Long uid){ return goodsBuyMapper.getGoodsBuyByUid(uid); }

    @Override
    public GoodsBuy getLastGoodsBuyByUid(Long uid){ return goodsBuyMapper.getLastGoodsBuyByUid(uid); }

    @Override
    public GoodsBuy getGoodsBuyById(Long oid) {
        return goodsBuyMapper.getGoodsBuyById(oid);
    }

    @Override
    public void insertGoodsBuy(GoodsBuy goodsBuy)
    {
        goodsBuyMapper.insertGoodsBuy(goodsBuy);
    }

    @Override
    public void updateGoodsBuy(GoodsBuy goodsBuy)
    {
        goodsBuyMapper.updateGoodsBuy(goodsBuy);
    }

    @Override
    public void deleteGoodsBuy(Long oid)
    {
        goodsBuyMapper.deleteGoodsBuy(oid);
    }

}
