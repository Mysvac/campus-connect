package com.mythovac.backend.controller;

import com.mythovac.backend.entity.Result;
import com.mythovac.backend.entity.Score;
import com.mythovac.backend.service.*;
import com.mythovac.backend.service.impl.UserServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("good-controller")
@RequestMapping("/api/good")
public class GoodController {
    private UserService userService;
    private GoodsBuyService goodsBuyService;
    private GoodsReleaseService goodsReleaseService;

    public GoodController(UserServiceImpl userService, GoodsBuyService goodsBuyService, GoodsReleaseService goodsReleaseService) {
        this.userService = userService;
        this.goodsBuyService = goodsBuyService;
        this.goodsReleaseService = goodsReleaseService;
    }

//    @GetMapping("/get-good-by-gid/{gid}")
//    public Result getScore(@PathVariable Long gid) {
//
//        if(res == null) return Result.error("评分不存在");
//        return Result.success(res);
//    }




}
