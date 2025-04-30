package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.Good;
import com.mythovac.backend.service.GoodsReleaseService;
import com.mythovac.backend.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoodsServiceImpl implements GoodsService {
    @Autowired
    private GoodsService goodsService;

    @Override
    public List<Good> getAllGoodsByTag(String tag){return goodsService.getAllGoodsByTag(tag);}

    @Override
    public List<Good> getAllGoods()
    {
        return goodsService.getAllGoods();
    }

    @Override
    public Good getGoodsById(Long gid)
    {
        return goodsService.getGoodsById(gid);
    }

    @Override
    public void insertGoods(Good goods)
    {
        goodsService.insertGoods(goods);
    }

    @Override
    public void updateGoods(Good goods)
    {
        goodsService.updateGoods(goods);
    }

    @Override
    public void deleteGoods(Long gid)
    {
        goodsService.deleteGoods(gid);
    }
}
