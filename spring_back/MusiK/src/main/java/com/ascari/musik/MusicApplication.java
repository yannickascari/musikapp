package com.ascari.musik;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
@EnableMongoRepositories
public class MusicApplication {

    private static final Logger logger = LoggerFactory.getLogger(MusicApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(MusicApplication.class, args);
        logger.info("Application is currently running ...");
    }

}
