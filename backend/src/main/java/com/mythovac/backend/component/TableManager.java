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

    /***
     * 运行时创建表格，如果不存在
     * @param args
     */
    @Override
    public void run(String... args) {
        createTableUsers();
        createTableGoods();
        createTableGoodsRelease();
        createTableGoodsBuy();
        createTableScores();
        createTableScoresComment();
        createTableScoresRelease();
        createTableTasks();
        createTableTasksRelease();
        createTableTasksHandle();
        createTableMessages();
        createTableMessagesRelease();
        createTableMessagesComment();
    }

    @PreDestroy
    public void onShutdown() {
        System.out.println("onShutdown...");
        if(Boolean.parseBoolean(dropTablesOnClose)) {
            dropTableMessagesComment();
            dropTableMessagesRelease();
            dropTableMessages();
            dropTableTasksHandle();
            dropTableTasksRelease();
            dropTableTasks();
            dropTableScoresComment();
            dropTableScoresRelease();
            dropTableScores();
            dropTableGoodsRelease();
            dropTableGoodsBuy();
            dropTableGoods();
            dropTableUsers();
            System.out.println("已删除表。");
        } else {
            System.out.println("当前选择不删除表。");
        }
    }

    // 用户表
    private void createTableUsers() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS users (
                uid BIGINT AUTO_INCREMENT PRIMARY KEY,
                permission INT NOT NULL CHECK( permission IN ( 0, 1, 2, 3 ) ),
                phone CHAR(11) NOT NULL UNIQUE,
                password CHAR(64) NOT NULL,
                wallet BIGINT NOT NULL,
                nickname CHAR(20) NOT NULL,
                gender INT NOT NULL CHECK( gender IN ( 0, 1, 2 ) ),
                email CHAR(32),
                profile CHAR(50),
                image CHAR(80)
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableUsers() {
        String dropTableSQL = "DROP TABLE IF EXISTS users;";
        jdbcTemplate.execute(dropTableSQL);
    }

    // 商品表
    private void createTableGoods() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS goods (
                gid BIGINT AUTO_INCREMENT PRIMARY KEY,
                uid BIGINT NOT NULL,
                price INT NOT NULL,
                name CHAR(32) NOT NULL,
                image CHAR(80),
                tag CHAR(32) NOT NULL,
                intro CHAR(100),
                quantity INT NOT NULL,
                sales INT,
                time BIGINT NOT NULL,
                CONSTRAINT FK_goods_uid FOREIGN KEY (uid) REFERENCES users (uid)
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableGoods() {
        String dropTableUsersSQL = "DROP TABLE IF EXISTS goods;";
        jdbcTemplate.execute(dropTableUsersSQL);
    }

    // 商品发布表
    private void createTableGoodsRelease() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS goods_release (
                gid BIGINT NOT NULL,
                uid BIGINT NOT NULL,
                CONSTRAINT PK_goods_release PRIMARY KEY (gid, uid),
                CONSTRAINT FK_goods_release_gid FOREIGN KEY (gid) REFERENCES goods (gid),
                CONSTRAINT FK_goods_release_uid FOREIGN KEY (uid) REFERENCES users (uid)
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableGoodsRelease() {
        String dropTableSQL = "DROP TABLE IF EXISTS goods_release;";
        jdbcTemplate.execute(dropTableSQL);
    }


    // 商品购买表
    private void createTableGoodsBuy() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS goods_buy (
                oid BIGINT AUTO_INCREMENT PRIMARY KEY,
                gid BIGINT NOT NULL,
                uid BIGINT NOT NULL,
                time BIGINT NOT NULL,
                sum INT NOT NULL,
                number INT NOT NULL,
                status INT NOT NULL CHECK( status IN ( 0, 1, 2, 3 ) ),
                notes CHAR(100),
                CONSTRAINT FK_goods_buy_gid FOREIGN KEY (gid) REFERENCES goods (gid),
                CONSTRAINT FK_goods_buy_uid FOREIGN KEY (uid) REFERENCES users (uid)
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableGoodsBuy() {
        String dropTableSQL = "DROP TABLE IF EXISTS goods_buy;";
        jdbcTemplate.execute(dropTableSQL);
    }

    // 任务表
    private void createTableTasks() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS tasks (
                tid BIGINT AUTO_INCREMENT PRIMARY KEY,
                uid BIGINT NOT NULL,
                money INT NOT NULL,
                name CHAR(20) NOT NULL,
                contact CHAR(50) NOT NULL,
                details TEXT NOT NULL,
                status INT NOT NULL CHECK( status IN ( 0, 1, 2, 3 ) ),
                tag CHAR(10) NOT NULL,
                time BIGINT NOT NULL,
                CONSTRAINT FK_tasks_uid FOREIGN KEY (uid) REFERENCES users (uid)
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableTasks() {
        String dropTableSQL = "DROP TABLE IF EXISTS tasks;";
        jdbcTemplate.execute(dropTableSQL);
    }

    // 任务发布表
    private void createTableTasksRelease() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS tasks_release (
                tid BIGINT NOT NULL,
                uid BIGINT NOT NULL,
                CONSTRAINT PK_tasks_release PRIMARY KEY (tid, uid),
                CONSTRAINT FK_tasks_release_gid FOREIGN KEY (tid) REFERENCES tasks (tid),
                CONSTRAINT FK_tasks_release_uid FOREIGN KEY (uid) REFERENCES users (uid)
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableTasksRelease() {
        String dropTableSQL = "DROP TABLE IF EXISTS tasks_release;";
        jdbcTemplate.execute(dropTableSQL);
    }

    // 任务处理表
    private void createTableTasksHandle() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS tasks_handle (
                tid BIGINT NOT NULL,
                uid BIGINT NOT NULL,
                status INT NOT NULL CHECK( status IN ( 0, 1, 2, 3 ) ),
                notes CHAR(100),
                time BIGINT NOT NULL,
                CONSTRAINT PK_tasks_handle PRIMARY KEY (tid, uid),
                CONSTRAINT FK_tasks_handle_gid FOREIGN KEY (tid) REFERENCES tasks (tid),
                CONSTRAINT FK_tasks_handle_uid FOREIGN KEY (uid) REFERENCES users (uid)
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableTasksHandle() {
        String dropTableSQL = "DROP TABLE IF EXISTS tasks_handle;";
        jdbcTemplate.execute(dropTableSQL);
    }

    // 评分
    private void createTableScores() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS scores (
                sid BIGINT AUTO_INCREMENT PRIMARY KEY,
                tag CHAR(30) NOT NULL,
                status INT NOT NULL CHECK( status IN ( 0, 1 ) ),
                num INT NOT NULL,
                goal CHAR(30) NOT NULL,
                intro CHAR(100) NOT NULL,
                image CHAR(80) NOT NULL,
                score DOUBLE
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableScores() {
        String dropTableSQL = "DROP TABLE IF EXISTS scores;";
        jdbcTemplate.execute(dropTableSQL);
    }

    // 评分发布表
    private void createTableScoresRelease() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS scores_release (
                sid BIGINT NOT NULL,
                uid BIGINT NOT NULL,
                time BIGINT NOT NULL,
                CONSTRAINT PK_scores_release PRIMARY KEY (sid, uid),
                CONSTRAINT FK_scores_release_gid FOREIGN KEY (sid) REFERENCES scores (sid),
                CONSTRAINT FK_scores_release_uid FOREIGN KEY (uid) REFERENCES users (uid)
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableScoresRelease() {
        String dropTableSQL = "DROP TABLE IF EXISTS scores_release;";
        jdbcTemplate.execute(dropTableSQL);
    }

    // 评分评价表
    private void createTableScoresComment() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS scores_comment (
                sid BIGINT NOT NULL,
                uid BIGINT NOT NULL,
                score INT NOT NULL CHECK( score IN ( 1, 2, 3, 4, 5 ) ),
                comment TEXT,
                time BIGINT NOT NULL,
                CONSTRAINT PK_scores_comment PRIMARY KEY (sid, uid),
                CONSTRAINT FK_scores_comment_gid FOREIGN KEY (sid) REFERENCES scores (sid),
                CONSTRAINT FK_scores_comment_uid FOREIGN KEY (uid) REFERENCES users (uid)
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableScoresComment() {
        String dropTableSQL = "DROP TABLE IF EXISTS scores_comment;";
        jdbcTemplate.execute(dropTableSQL);
    }

    // 留言表
    private void createTableMessages() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS messages (
                mid BIGINT AUTO_INCREMENT PRIMARY KEY,
                uid BIGINT NOT NULL,
                content TEXT NOT NULL,
                title CHAR(30) NOT NULL,
                praise INT NOT NULL,
                tag CHAR(10) NOT NULL,
                time BIGINT NOT NULL,
                CONSTRAINT FK_messages_uid FOREIGN KEY (uid) REFERENCES users (uid)
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableMessages() {
        String dropTableSQL = "DROP TABLE IF EXISTS messages;";
        jdbcTemplate.execute(dropTableSQL);
    }

    // 留言发布表
    private void createTableMessagesRelease() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS messages_release (
                mid BIGINT NOT NULL,
                uid BIGINT NOT NULL,
                CONSTRAINT PK_messages_release PRIMARY KEY (mid, uid),
                CONSTRAINT FK_messages_release_mid FOREIGN KEY (mid) REFERENCES messages (mid),
                CONSTRAINT FK_messages_release_uid FOREIGN KEY (uid) REFERENCES users (uid)
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableMessagesRelease() {
        String dropTableSQL = "DROP TABLE IF EXISTS messages_release;";
        jdbcTemplate.execute(dropTableSQL);
    }

    // 留言评论表
    private void createTableMessagesComment() { // SQL statements
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS messages_comment (
                cid BIGINT AUTO_INCREMENT PRIMARY KEY,
                mid BIGINT NOT NULL,
                uid BIGINT NOT NULL,
                content TEXT NOT NULL,
                praise INT NOT NULL,
                time BIGINT NOT NULL,
                CONSTRAINT FK_messages_comment_mid FOREIGN KEY (mid) REFERENCES messages (mid),
                CONSTRAINT FK_messages_comment_uid FOREIGN KEY (uid) REFERENCES users (uid)
                );
                """;
        jdbcTemplate.execute(createTableSQL);
    }
    private void dropTableMessagesComment() {
        String dropTableSQL = "DROP TABLE IF EXISTS messages_comment;";
        jdbcTemplate.execute(dropTableSQL);
    }

}
