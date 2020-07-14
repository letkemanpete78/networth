package ca.letkeman.networth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ca.letkeman.networth.dto.CurrencyRepository;
import ca.letkeman.networth.dto.LineItemRepository;
import ca.letkeman.networth.model.Category;
import ca.letkeman.networth.model.Currency;
import ca.letkeman.networth.model.LineItem;
import ca.letkeman.networth.model.Type;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class NetworthControllerTest {

  @Autowired
  private LineItemRepository lineItemRepository;

  @Autowired
  private CurrencyRepository currencyRepository;

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private JdbcTemplate jdbcTemplate;

  @LocalServerPort
  private int port;

  @Autowired
  private TestRestTemplate restTemplate;

  @Autowired
  private NetworthController controller;

  @Test
  public void contextLoads() throws Exception {
    assertThat(controller).isNotNull();
    assertThat(jdbcTemplate).isNotNull();
    assertThat(restTemplate).isNotNull();
  }

  @Test
  public void greetingShouldReturnDefaultMessage() throws Exception {
    assertThat(this.restTemplate.getForObject("http://localhost:" + port + "/",
        String.class)).contains("[]");
  }

  @Test
  void getDummyItems() {
    String val1 = "\"type\":\"ASSET\",\"category\":\"SHORT_TERM\",\"label\":\"label 1\"";
    String val2 = "\"type\":\"ASSET\",\"category\":\"LONG_TERM\",\"label\":\"label 6\"";
    String val3 = "\"type\":\"LIABILITY\",\"category\":\"SHORT_TERM\",\"label\":\"label 11\"";
    String val4 = "\"type\":\"LIABILITY\",\"category\":\"LONG_TERM\",\"label\":\"label 16\"";
    String val5 = "\"currency\":{\"id\":1,\"symbol\":\"CAD\",\"rate\":1.0}}";

    final String result = this.restTemplate.getForObject("http://localhost:" + port + "/dummy",
        String.class);
    assertThat(result).contains(val1);

    assertThat(result).contains(val2);

    assertThat(result).contains(val3);

    assertThat(result).contains(val4);

    assertThat(result).contains(val5);
  }

  @Test
  void deleteItems() {
  }

  @Test
  void getItems() throws Exception {
    /*

        const urlCurrencies = 'http://localhost:8080/currencies'

        [{"label":"","value":4,"uuid":"1e586e2-5d5c-7a3-6f7-eab271d501","type":"ASSET","category":"SHORT_TERM"},{"id":193,"uuid":"22763c3-717e-58b0-2dd6-d5854f510d","type":"LIABILITY","category":"SHORT_TERM","label":"","value":1.33333}]


     */
    Currency currency = new Currency();
    currency.setSymbol("CAD");
    currency.setId(1);
    currency.setRate(1.0);
    LineItem lineItem = new LineItem(
        1, "22763c3-717e-58b0-2dd6-d5854f510d", Type.ASSET, Category.SHORT_TERM,
        "label 1", 10f, currency
    );

      mockMvc.perform(get("/?category=short_term&type=asset","")
          .contentType("application/json")
          .content(objectMapper.writeValueAsString(lineItem)))
          .andExpect(status().isOk());

      LineItem item = ((List<LineItem>) lineItemRepository.findAll()).get(0);
      assertThat(item.getUuid()).isEqualTo("22763c3-717e-58b0-2dd6-d5854f510d");
  }


  @Test
  void submitdata() {
  }

  @Test
  void renderPage() {


  }

  @Test
  void getRate() {
  }

  @Test
  void getcurrencies() {
  }
}



