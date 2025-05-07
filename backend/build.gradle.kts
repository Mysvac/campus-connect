plugins {
    java
    id("org.springframework.boot") version "3.4.4"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.mythovac"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    maven { url = uri("https://maven.aliyun.com/nexus/content/repositories/google") }
    maven { url = uri("https://maven.aliyun.com/nexus/content/groups/public") }
    google()
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")

    implementation("mysql:mysql-connector-java:8.0.33")
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("org.springframework.security:spring-security-crypto")

    compileOnly("org.projectlombok:lombok")

    implementation("org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.3")


    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok") // 取消注释，启用注解处理



    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
