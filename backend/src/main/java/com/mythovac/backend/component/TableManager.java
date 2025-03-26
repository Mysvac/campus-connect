package com.mythovac.backend.component;

import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * 程序启动监听
 * 创建表格，保证表格存在
 * 默认在程序启动时创建表格（如果不存在）
 * 根据参数，设置程序结束时，是否删除表格
 * */
@Component
public class TableManager  implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;
    @Value("${drop.tables.on.close}")
    private String dropTablesOnClose;

    public TableManager(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        createTableUser();
    }

    @PreDestroy
    public void onShutdown() {
        if(Boolean.parseBoolean(dropTablesOnClose)) {
            dropTableUser();
            System.out.println("已删除表。");
        } else {
            System.out.println("当前选择不删除表。");
        }
    }

    private void createTableUser() { // SQL statements
        String createTableUsersSQL = """
                CREATE TABLE IF NOT EXISTS users (
                uid BIGINT AUTO_INCREMENT PRIMARY KEY,
                permission INT NOT NULL CHECK( permission IN ( 0, 1, 2, 3 ) ),
                phone CHAR(11) NOT NULL,
                password CHAR(32) NOT NULL,
                wallet BIGINT NOT NULL,
                nickname CHAR(20) NOT NULL,
                gender INT NOT NULL CHECK( permission IN ( 0, 1, 2 ) ),
                email CHAR(32),
                profile CHAR(50),
                image CHAR(80)
                );
                """;
        jdbcTemplate.execute(createTableUsersSQL);
    }
    private void dropTableUser() {
        String dropTableUsersSQL = "DROP TABLE IF EXISTS users;";
        jdbcTemplate.execute(dropTableUsersSQL);
    }




}
