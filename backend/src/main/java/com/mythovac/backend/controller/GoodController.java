package com.mythovac.backend.controller;

import com.mythovac.backend.entity.Result;
import com.mythovac.backend.entity.Good;
import com.mythovac.backend.entity.GoodsBuy;
import com.mythovac.backend.entity.GoodsRelease;
import com.mythovac.backend.service.*;
import com.mythovac.backend.service.impl.UserServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("good-controller")
@RequestMapping("/api/good")
public class GoodController {
    private UserService userService;
    private GoodsService goodsService;
    private GoodsBuyService goodsBuyService;
    private GoodsReleaseService goodsReleaseService;

    public GoodController(UserServiceImpl userService,GoodsService goodsService , GoodsBuyService goodsBuyService, GoodsReleaseService goodsReleaseService) {
        this.userService = userService;
        this.goodsService = goodsService;
        this.goodsBuyService = goodsBuyService;
        this.goodsReleaseService = goodsReleaseService;
    }

    @GetMapping("/get-good-by-gid/{gid}")
    public Result getScore(@PathVariable Long gid) {
        Good res = goodsService.getGoodsById(gid);
        if(res == null) return Result.error("商品不存在");
        return Result.success(res);
    }

    @GetMapping("/get-good-by-tag/{tag}")
    public Result getScore(@PathVariable Integer tag) {
        List<Good> res = goodsService.getAllGoodsByTag(tag);
        return Result.success(res);
    }

    @GetMapping("/get-all-goods")
    public Result getAllGoods() {
        List<Good> res = goodsService.getAllGoods();
        return Result.success(res);
    }


    @GetMapping("/add-goods")
    public Result addGoods(@RequestBody Good good) {
        if(good == null || good.getName() == null || good.getName().isEmpty()) {
            return Result.error("商品内容无效");
        }
        if(good.getUid() == null) {
            return Result.error("用户不存在");
        }
        if(userService.getUserById(good.getUid()) == null){
            return Result.error("用户不存在");
        }
        goodsService.insertGoods(good);
        return Result.success("添加商品成功");
    }


    @GetMapping("/delete-goods-by-gid/{gid}")
    public Result addGoods(@PathVariable Long gid) {
        if(goodsService.getGoodsById(gid) == null){
            return Result.error("商品不存在");
        }
        goodsService.deleteGoods(gid);
        return Result.success("添加商品成功");
    }

}
