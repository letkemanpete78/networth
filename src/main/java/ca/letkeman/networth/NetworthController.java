package ca.letkeman.networth;

import ca.letkeman.networth.dto.CurrencyRepository;
import ca.letkeman.networth.dto.LineItemRepository;
import ca.letkeman.networth.model.Category;
import ca.letkeman.networth.model.Currency;
import ca.letkeman.networth.model.LineItem;
import ca.letkeman.networth.model.Type;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Transactional
@CrossOrigin(origins = "*")
@RestController
public class NetworthController {

  private final LineItemRepository lineItemRepository;

  private final CurrencyRepository currencyRepository;

  public NetworthController(LineItemRepository lineItemRepository,
      CurrencyRepository currencyRepository) {
    this.lineItemRepository = lineItemRepository;
    this.currencyRepository = currencyRepository;
  }


  @PostMapping(path = "/deletedata")
  public @ResponseBody
  boolean deleteItems(@RequestBody String payload) {
    /*
    sample payload
    "3bdea-5d0b-02f7-58f6-cbdde6ac40"
     */
    String uuid = payload.replace("\"", "");
    lineItemRepository.deleteByuuid(uuid);
    return true;
  }

  @GetMapping(path = "/all")
  public @ResponseBody
  Iterable<LineItem> getItems() {
    return lineItemRepository.findAll();
  }

  @GetMapping(path = "/dummy")
  public @ResponseBody
  Iterable<LineItem> getDummyItems() {
    return createDummyData();
  }

  @CrossOrigin(origins = "*")
  @PostMapping("/submitdata")
  public String submitdata(@RequestBody String payload) {
    /*
    sample payload
    [{"id":194,"uuid":"1e586e2-5d5c-7a3-6f7-eab271d501","type":"ASSET","category":"SHORT_TERM","label":"","value":4.166666666666667,"currency":{"id":2,"symbol":"USD","rate":1.2}},
    {"id":193,"uuid":"22763c3-717e-58b0-2dd6-d5854f510d","type":"LIABILITY","category":"SHORT_TERM","label":"","value":0.5358354166666667,"currency":{"id":2,"symbol":"USD","rate":1.2}}]
     */
    updateLineItems(payload);
    return "server found";
  }

  @RequestMapping(value = "/",
      method = RequestMethod.GET,
      produces = {MediaType.APPLICATION_JSON_VALUE},
      consumes = MediaType.ALL_VALUE)
  public String renderPage(
      @RequestParam(value = "type", defaultValue = "asset") String type,
      @RequestParam(value = "category", defaultValue = "long_term") String category) {
    /*
    urls:
        /?category=short_term&type=asset
        /?category=long_term&type=asset
        /?category=short_term&type=liability
        /?category=long_term&type=liability

    sample response
[{"id":194,"uuid":"1e586e2-5d5c-7a3-6f7-eab271d501","type":"ASSET","category":"SHORT_TERM","label":"","value":22.0,"currency":{"id":1,"symbol":"CAD","rate":1.0}},
{"id":195,"uuid":"3bdea-5d0b-02f7-58f6-cbdde6ac40","type":"ASSET","category":"SHORT_TERM","label":"","value":2222.0,"currency":{"id":1,"symbol":"CAD","rate":1.0}}]
     */
    return getDataString(type, category);
  }

  @RequestMapping(value = "/getrate",
      method = RequestMethod.GET,
      produces = {MediaType.APPLICATION_JSON_VALUE},
      consumes = MediaType.ALL_VALUE)
  public String getRate(@RequestParam(value = "symbol", defaultValue = "CAD") String symbol) {
    /*
    sample response
    {"id":1,"symbol":"CAD","rate":1.0}
     */
    ObjectMapper mapperObj = new ObjectMapper();
    try {
      return mapperObj.writeValueAsString(getRateBySymbol(symbol));
    } catch (JsonProcessingException e) {
      e.printStackTrace();
      return "error";
    }
  }

  @RequestMapping(value = "/currencies",
      method = RequestMethod.GET,
      produces = {MediaType.APPLICATION_JSON_VALUE},
      consumes = MediaType.ALL_VALUE)
  public String getcurrencies() {
    /*
    sample response
    [{"id":1,"symbol":"CAD","rate":1.0},{"id":2,"symbol":"USD","rate":1.2},{"id":3,"symbol":"GPD","rate":1.5}]
     */
    ObjectMapper mapperObj = new ObjectMapper();
    try {
      return mapperObj.writeValueAsString(currencyList());
    } catch (JsonProcessingException e) {
      e.printStackTrace();
      return "error";
    }
  }

  protected String getDataString( String type, String category) {
    List<LineItem> lineItems = (List<LineItem>) lineItemRepository.findAll();

    ObjectMapper mapperObj = new ObjectMapper();

    try {
      return mapperObj.writeValueAsString(lineItems.stream()
          .filter(x -> x.getCategory()
              .toString()
              .toLowerCase()
              .equals(category.toLowerCase()) && x
              .getType().toString()
              .toLowerCase()
              .equals(type.toLowerCase()))
          .toArray());
    } catch (JsonProcessingException e) {
      e.printStackTrace();
      return "error";
    }
  }

  protected Currency getRateBySymbol(String symbol) {
    return currencyRepository.findBySymbol(symbol);
  }

  protected List<Currency> currencyList() {
    return (List<Currency>) currencyRepository.findAll();
  }

  protected String updateLineItems(String testStr) {
    List<LineItem> lineItems = null;
    try {
      lineItems = new ObjectMapper().readValue(testStr, new TypeReference<List<LineItem>>() {
      });
    } catch (JsonProcessingException e) {
      e.printStackTrace();
    }

    if (lineItems == null) {
      return "nothing to do";
    }
    List<String> uuidList =  lineItems.stream().map(LineItem::getUuid).collect(Collectors.toList());
    List<LineItem> foundItems = lineItemRepository.findByuuidIn(uuidList);
    List<LineItem> updateItems = lineItems.stream()
        .peek(x -> {
          for (LineItem y : foundItems) {
            if (y.getUuid().equals(x.getUuid())) {
              x.setId(y.getId());
            }
          }
          if (x.getCurrency() == null) {
            new Exception("null currency");
          }
        })
        .collect(Collectors.toList());
    lineItemRepository.saveAll(updateItems);

    return "updated\n" + updateItems.toString();
  }

  protected List<LineItem> createDummyData() {
    double baseValue = 1472.94;
    List<LineItem> lineItems = new ArrayList<>();
    Currency currency = new Currency();
    currency.setSymbol("CAD");
    currency.setId(1);
    currency.setRate(1.0);
    for (int i = 1; i < 6; i++) {
      lineItems.add(
          new LineItem(i, UUID.randomUUID().toString(), Type.ASSET, Category.SHORT_TERM,
              "label " + i,
              (float) (baseValue * i * i),
              currency
          ));
    }
    for (int i = 6; i < 11; i++) {
      lineItems.add(
          new LineItem(i, UUID.randomUUID().toString(), Type.ASSET, Category.LONG_TERM,
              "label " + i,
              (float) (baseValue * i * i),
              currency));
    }
    for (int i = 11; i < 16; i++) {
      lineItems.add(
          new LineItem(i, UUID.randomUUID().toString(), Type.LIABILITY, Category.SHORT_TERM,
              "label " + i,
              (float) (baseValue * i * i),
              currency));
    }
    for (int i = 16; i < 21; i++) {
      lineItems.add(
          new LineItem(i, UUID.randomUUID().toString(), Type.LIABILITY, Category.LONG_TERM,
              "label " + i,
              (float) (baseValue * i * i),
              currency));
    }
    return lineItems;
  }
}
