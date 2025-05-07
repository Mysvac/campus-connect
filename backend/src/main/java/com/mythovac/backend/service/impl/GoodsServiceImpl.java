package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.Good;
import com.mythovac.backend.mapper.GoodsMapper;
import com.mythovac.backend.mapper.TasksHandleMapper;
import com.mythovac.backend.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoodsServiceImpl implements GoodsService {
    private GoodsMapper goodsMapper;

    @Autowired
    public GoodsServiceImpl(GoodsMapper goodsMapper) {
        this.goodsMapper = goodsMapper;
    }

    @Override
    public List<Good> getAllGoodsByTag(String tag){return goodsMapper.getAllGoodsByTag(tag);}

    @Override
    public List<Good> getAllGoods()
    {
        return goodsMapper.getAllGoods();
    }


    @Override
    public List<String> getAllTags(){ return goodsMapper.getAllTags(); }

    @Override
    public Good getGoodsById(Long gid)
    {
        return goodsMapper.getGoodsById(gid);
    }

    @Override
    public void insertGoods(Good goods)
    {
        goodsMapper.insertGoods(goods);
    }

    @Override
    public void updateGoods(Good goods)
    {
        goodsMapper.updateGoods(goods);
    }

    @Override
    public void deleteGoods(Long gid)
    {
        goodsMapper.deleteGoods(gid);
    }
}
