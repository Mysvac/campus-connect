package com.mythovac.backend.service;

import com.mythovac.backend.entity.GoodsBuy;

import java.util.List;

public interface GoodsBuyService {
    List<GoodsBuy> getAllGoodsBuy();
    GoodsBuy getGoodsBuyById(Long oid);
    void insertGoodsBuy(GoodsBuy goodsBuy);
    void updateGoodsBuy(GoodsBuy goodsBuy);
    void deleteGoodsBuy(Long oid);
}
