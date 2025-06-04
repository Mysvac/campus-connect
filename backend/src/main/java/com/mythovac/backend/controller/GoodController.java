package com.mythovac.backend.controller;

import com.mythovac.backend.entity.*;
import com.mythovac.backend.service.*;
import com.mythovac.backend.service.impl.UserServiceImpl;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 商品控制器
 * 处理商品相关请求，包括获取商品、购买商品、添加商品等
 */
@RestController("good-controller")
@RequestMapping("/api/good")
public class GoodController {
    private final UserService userService;
    private final GoodsService goodsService;
    private final GoodsBuyService goodsBuyService;
    private final GoodsReleaseService goodsReleaseService;

    public GoodController(UserServiceImpl userService,GoodsService goodsService , GoodsBuyService goodsBuyService, GoodsReleaseService goodsReleaseService) {
        this.userService = userService;
        this.goodsService = goodsService;
        this.goodsBuyService = goodsBuyService;
        this.goodsReleaseService = goodsReleaseService;
    }

    /**
     * 获取指定商品信息
     * @param gid 商品ID
     * @return 商品信息或错误信息，单个
     */
    @GetMapping("/get-good-by-gid/{gid}")
    public Result getScore(@PathVariable Long gid) {
        Good res = goodsService.getGoodsById(gid);
        return res == null ? Result.error("商品不存在") : Result.success(res);
    }

    /**
     * 根据Tag获取商品列表
     * @param tag 商品Tag
     * @return 商品信息或错误信息，数组
     */
    @GetMapping("/get-good-by-tag/{tag}")
    public Result getScore(@PathVariable String tag) {
        List<Good> res = goodsService.getAllGoodsByTag(tag);
        return Result.success(res);
    }

    /**
     * 获取所有商品信息
     * @return 所有商品发信息或错误信息，数组
     */
    @GetMapping("/get-all-goods")
    public Result getAllGoods() {
        List<Good> res = goodsService.getAllGoods();
        return Result.success(res);
    }

    /**
     * 获取用户发布的商品列表
     * @param uid uid
     * @return 用户发布的商品列表
     */
    @GetMapping("/get-all-goods-by-uid/{uid}")
    public Result getAllGoodsByUid(@PathVariable Long uid) {
        List<Good> res = goodsService.getAllGoodsByUid(uid);
        return Result.success(res);
    }

    /**
     * 获取当前用户的购买的商品列表
     * @param session HttpSession
     * @return 用户购买的商品列表
     */
    @GetMapping("/get-goodsbuy")
    public Result getAllGoodsBuyByUid(HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long) session.getAttribute("uid");
        List<GoodsBuy> res = goodsBuyService.getGoodsBuyByUid(uid);
        return Result.success(res);
    }

    /**
     * 更新购买记录
     * @param goodsBuy 购买记录
     * @return
     */
    @PostMapping("/update-goodsbuy")
    public Result updateGoodsBuy(@RequestBody GoodsBuy goodsBuy) {
        var oldBuy = goodsBuyService.getGoodsBuyById(goodsBuy.getOid());
        if(goodsBuy.getGid() == null) goodsBuy.setGid(oldBuy.getGid());
        if(goodsBuy.getUid() == null) goodsBuy.setUid(oldBuy.getUid());
        if(goodsBuy.getNumber() == null) goodsBuy.setNumber(oldBuy.getNumber());
        if(goodsBuy.getTime() == null) goodsBuy.setTime(oldBuy.getTime());
        if(goodsBuy.getStatus() == null) goodsBuy.setStatus(oldBuy.getStatus());
        if(goodsBuy.getSum() == null) goodsBuy.setSum(oldBuy.getSum());

        goodsBuyService.updateGoodsBuy(goodsBuy);
        return Result.success("更新购买记录成功");
    }

    /**
     * 获取所有购买记录
     * @return Result 所有购买记录列表
     */
    @GetMapping("/get-all-goodsbuy")
    public Result getAllGoodsBuy() {
        List<GoodsBuy> res = goodsBuyService.getAllGoodsBuy();
        return Result.success(res);
    }

    /**
     * 获取可能的Tag列表
     * @return Tags列表
     */
    @GetMapping("/get-tags")
    public Result getTags() {
        List<String> tags = goodsService.getAllTags();
        return Result.success(tags);
    }

    /**
     * 购买商品
     * @param gid 商品ID
     * @param session HttpSession
     * @return 是否购买成功
     */
    @PostMapping("/purchase/{gid}")
    public Result purchase(@PathVariable Long gid, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long) session.getAttribute("uid");
        Good good = goodsService.getGoodsById(gid);
        if (good == null) return Result.error("商品不存在");
        if (good.getQuantity() == 0) return Result.error("商品空货");

        User usr = userService.getUserById(uid);
        if(usr.getWallet() < good.getPrice()) {
            return Result.error("余额不足");
        }

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
        good.setSales(good.getSales() == null ? 1 : good.getSales() + 1);
        goodsService.updateGoods(good);

        usr.setWallet(usr.getWallet() - good.getPrice());
        userService.updateUser(usr);

        return Result.success( res );
    }




    /**
     * 发布商品
     * @param good 商品信息
     * @param session HttpSession
     * @return 是否发布成功
     */
    @PostMapping("/add-goods")
    public Result addGoods(@RequestBody Good good, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        if (good == null || good.getName() == null || good.getName().isEmpty()) {
            return Result.error("商品内容无效");
        }

        Long uid = (Long) session.getAttribute("uid");
        good.setUid(uid);
        good.setSales(0);
        good.setQuantity(good.getQuantity() == null ? 0 : good.getQuantity());
        good.setTime(System.currentTimeMillis());

        goodsService.insertGoods(good);
        return Result.success("添加商品成功");
    }


    /**
     * 删除商品
     * @param gid 商品ID
     * @param session HttpSession
     * @return 是否删除成功
     */
    @DeleteMapping("/delete-goods-by-gid/{gid}")
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

    @PostMapping("/update-good")
    public Result updateGood(@RequestBody Good good, HttpSession session) {
        Result sessionCheck = UserController.checkSession(session);
        if (sessionCheck != null) return sessionCheck;

        Long uid = (Long) session.getAttribute("uid");
        Integer permission = (Integer) session.getAttribute("permission");

        if (good == null || good.getGid() == null) {
            return Result.error("商品信息无效");
        }

        Good existingGood = goodsService.getGoodsById(good.getGid());
        if (existingGood == null) {
            return Result.error("商品不存在");
        }

        if (!Objects.equals(existingGood.getUid(), uid) && permission != 3) {
            return Result.error("无权限修改此商品");
        }

        // 保持原有的uid和sales不变
        good.setUid(existingGood.getUid());
        good.setSales(existingGood.getSales());
        good.setTime(System.currentTimeMillis());

        goodsService.updateGoods(good);
        return Result.success("更新商品成功");
    }
}
