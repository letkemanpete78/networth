package ca.letkeman.networth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class NetworthApplication {

  public static void main(String[] args) {
    SpringApplication.run(NetworthApplication.class, args);
  }
}
