package com.mythovac.backend.entity;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoodsBuy {
    private Long oid;
    private Long gid;
    private Long uid;
    private Long time;
    private Integer sum;
    private Integer number;
    private Integer status;
    private String notes;

}
