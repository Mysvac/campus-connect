package com.mythovac.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * 图片上传控制器
 * 处理图片上传请求
 */
@RestController
@RequestMapping("/api/image")
public class ImageController {
    // 注入配置文件中的上传目录和访问前缀
    @Value("${file.upload-dir}") // 从配置文件中读取上传目录
    private String uploadDir;

    // 访问前缀，用于返回图片的访问地址
    @Value("${file.access-prefix}") // 访问前缀，如 /images/
    private String accessPrefix;

    /**
     * 上传图片
     * @param file 上传的图片文件
     * @return 图片的访问地址或错误信息
     */
    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // 确保上传目录存在
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            String fileExtension = null;
            if (originalFilename != null) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID() + fileExtension;

            // 保存文件
            Path filePath = Paths.get(uploadDir, uniqueFileName);
            Files.write(filePath, file.getBytes());

            // 返回访问地址
            return accessPrefix + uniqueFileName;
        } catch (IOException e) {
            e.printStackTrace();
            return "上传失败: " + e.getMessage();
        }
    }
}



