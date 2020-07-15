package ca.letkeman.networth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ca.letkeman.networth.dto.CurrencyRepository;
import ca.letkeman.networth.dto.LineItemRepository;
import ca.letkeman.networth.model.Category;
import ca.letkeman.networth.model.Currency;
import ca.letkeman.networth.model.LineItem;
import ca.letkeman.networth.model.Type;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;


@ActiveProfiles("test")
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

  @BeforeAll
  public static void initDB() {
    System.out.println("sample before all");
  }


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
  void deleteItems() throws JsonProcessingException {
    initTestValues();
    String payload = "\"abc999-717e-58b0-2dd6-d5854f510d\"";

    try {
      mockMvc.perform(get("/?deletedata", "")
          .contentType("application/json")
          .content(objectMapper.writeValueAsString(payload)))
          .andExpect(status().isOk());

      List<LineItem> items = (List<LineItem>) lineItemRepository.findAll();
      boolean isfound = items.stream().anyMatch(x -> x.getUuid().equals(payload));
      assertTrue((items.size() > 0));
      assertFalse(isfound);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @Test
  void getItems() throws Exception {
    LineItem lineItem = initTestValues();

    mockMvc.perform(get("/?category=short_term&type=asset", "")
        .contentType("application/json")
        .content(objectMapper.writeValueAsString(lineItem)))
        .andExpect(status().isOk());

    List<LineItem> items = (List<LineItem>) lineItemRepository.findAll();
    assertTrue(items.stream().anyMatch(item -> item.getUuid().equals("22763c3-717e-58b0-2dd6-d5854f510d")));
  }

  @Test
  void submitdata() {
    initTestValues();
    String payload =
        "[{\"id\":1,\"uuid\":\"22763c3-717e-58b0-2dd6-d5854f510d\",\"type\":\"ASSET\",\"category\":\"SHORT_TERM\",\"label\":\"\",\"value\":4.166666666666667,\"currency\":{\"id\":1,\"symbol\":\"CAD\",\"rate\":1}},"
            + "{\"id\":5,\"uuid\":\"POI999-717e-58b0-2dd6-d5854f510d\",\"type\":\"LIABILITY\",\"category\":\"SHORT_TERM\",\"label\":\"\",\"value\":0.5358354166666667,\"currency\":{\"id\":1,\"symbol\":\"CAD\",\"rate\":1}}]";
    try {
      mockMvc.perform(post("/submitdata", "")
          .contentType("application/json")
          .content(payload))
          .andExpect(status().isOk());
    } catch (Exception e) {
      e.printStackTrace();
    }

    List<LineItem> items = (List<LineItem>) lineItemRepository.findAll();
    assertTrue(items.size() == 3);
    boolean foundOne = items.stream()
        .anyMatch(x -> x.getUuid().equals("22763c3-717e-58b0-2dd6-d5854f510d"));
    boolean foundTwo = items.stream()
        .anyMatch(x -> x.getUuid().equals("POI999-717e-58b0-2dd6-d5854f510d"));
    boolean foundThree = items.stream()
        .anyMatch(x -> x.getUuid().equals("abc999-717e-58b0-2dd6-d5854f510d"));
    assertTrue(foundOne);
    assertTrue(foundTwo);
    assertTrue(foundThree);
  }

  @Test
  void renderPage() {
    initTestValues();
    try {
      MvcResult pageValue = mockMvc.perform(get("/?category=short_term&type=asset", "")
          .contentType("application/json")
          .content(objectMapper.writeValueAsString("")))
          .andExpect(status().isOk())
          .andReturn();
      String expected = "\"uuid\":\"22763c3-717e-58b0-2dd6-d5854f510d\",\"type\":\"ASSET\",\"category\":\"SHORT_TERM\",\"label\":\"label 1\",\"value\":10.0,\"currency\":{\"id\":1,\"symbol\":\"CAD\",\"rate\":1.0}}]";
      assertTrue(pageValue.getResponse().getContentAsString().contains(expected));
    } catch (Exception e) {
      e.printStackTrace();
    }
    try {
      MvcResult pageValue = mockMvc.perform(get("/?category=long_term&type=liability", "")
          .contentType("application/json")
          .content(objectMapper.writeValueAsString("")))
          .andExpect(status().isOk())
          .andReturn();
      String expected = "\"uuid\":\"abc999-717e-58b0-2dd6-d5854f510d\",\"type\":\"LIABILITY\",\"category\":\"LONG_TERM\",\"label\":\"label 22\",\"value\":99.89,\"currency\":{\"id\":1,\"symbol\":\"CAD\",\"rate\":1.0}}]";
      assertTrue(pageValue.getResponse().getContentAsString().contains(expected));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @Test
  void getcurrencies() {
    initTestValues();
    try {
      MvcResult mvcResult =  mockMvc.perform(get("/currencies", "")
          .contentType("application/json")
          .content(objectMapper.writeValueAsString("")))
          .andExpect(status().isOk())
          .andReturn();
      String expected = ",\"symbol\":\"CAD\",\"rate\":1.0}]";
      assertTrue(mvcResult.getResponse().getContentAsString().contains(expected));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private LineItem initTestValues() {
    lineItemRepository.deleteAll();
    Currency currency = new Currency();
    currency.setSymbol("CAD");
    currency.setId(1);
    currency.setRate(1.0);
    currencyRepository.save(currency);
    LineItem lineItem = new LineItem(
        1, "22763c3-717e-58b0-2dd6-d5854f510d", Type.ASSET, Category.SHORT_TERM,
        "label 1", 10f, currency
    );
    LineItem lineItem1 = new LineItem(
        2, "abc999-717e-58b0-2dd6-d5854f510d", Type.LIABILITY, Category.LONG_TERM,
        "label 22", 99.89f, currency
    );
    lineItemRepository.saveAll(Arrays.asList(lineItem1, lineItem));

    return lineItem;
  }
}
