package com.mythovac.backend.entity;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long uid;
    private Integer permission;
    private String phone;
    private String password;
    private Long wallet;
    private String nickname;
    private Integer gender;
    private String email;
    private String profile;
    private String image;

}



