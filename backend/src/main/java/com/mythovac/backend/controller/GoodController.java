package com.mythovac.backend.controller;

import com.mythovac.backend.entity.Result;
import com.mythovac.backend.entity.Good;
import com.mythovac.backend.entity.GoodsBuy;
import com.mythovac.backend.entity.GoodsRelease;
import com.mythovac.backend.service.*;
import com.mythovac.backend.service.impl.UserServiceImpl;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
        return res == null ? Result.error("商品不存在") : Result.success(res);
    }

    @GetMapping("/get-good-by-tag/{tag}")
    public Result getScore(@PathVariable String tag) {
        List<Good> res = goodsService.getAllGoodsByTag(tag);
        return Result.success(res);
    }

    @GetMapping("/get-all-goods")
    public Result getAllGoods() {
        List<Good> res = goodsService.getAllGoods();
        return Result.success(res);
    }

    @GetMapping("/get-tags")
    public Result getTags() {
        List<String> tags = goodsService.getAllTags();
        List<Map<String, Object>> result = new ArrayList<>();
        int id = 1;
        for (String tagName : tags) {
            Map<String, Object> tagMap = new HashMap<>();
            tagMap.put("id", id++);
            tagMap.put("name", tagName);
            result.add(tagMap);
        }
        return Result.success(result);
    }

    @PostMapping("/purchase/{gid}")
    public Result purchase(@PathVariable Long gid, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long) session.getAttribute("uid");
        Good good = goodsService.getGoodsById(gid);
        if (good == null) return Result.error("商品不存在");
        if (good.getQuantity() == 0) return Result.error("商品空货");

        GoodsBuy goodsBuy = new GoodsBuy();
        goodsBuy.setGid(gid);
        goodsBuy.setUid(uid);
        goodsBuy.setNumber(1);
        goodsBuy.setTime(System.currentTimeMillis());
        goodsBuy.setStatus(0);
        goodsBuy.setSum(good.getPrice());
        goodsBuyService.insertGoodsBuy(goodsBuy);

        GoodsBuy res = goodsBuyService.getLastGoodsBuyByUid(uid);
        good.setQuantity(good.getQuantity() - 1);
        goodsService.updateGoods(good);

        return Result.success( res );
    }


    @GetMapping("/add-goods")
    public Result addGoods(@RequestBody Good good, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        if (good == null || good.getName() == null || good.getName().isEmpty()) {
            return Result.error("商品内容无效");
        }

        Long uid = (Long) session.getAttribute("uid");
        good.setUid(uid);
        good.setTime(System.currentTimeMillis());

        goodsService.insertGoods(good);
        return Result.success("添加商品成功");
    }


    @GetMapping("/delete-goods-by-gid/{gid}")
    public Result addGoods(@PathVariable Long gid, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long)(session.getAttribute("uid"));
        Integer permission = (Integer)(session.getAttribute("permission"));

        if(goodsService.getGoodsById(gid) == null){
            return Result.error("商品不存在");
        }
        Good good = goodsService.getGoodsById(gid);
        if (good == null) return Result.error("商品不存在");
        if (!Objects.equals(good.getUid(), uid) && permission != 3) {
            return Result.error("用户不可用");
        }

        goodsService.deleteGoods(gid);
        return Result.success("添加商品成功");
    }

}
