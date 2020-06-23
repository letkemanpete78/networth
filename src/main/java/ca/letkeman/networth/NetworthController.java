package ca.letkeman.networth;

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
import org.springframework.beans.factory.annotation.Autowired;
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

  @Autowired
  private LineItemRepository lineItemRepository;

  @PostMapping(path = "/deletedata")
  public @ResponseBody
  boolean deleteItems(@RequestBody String payload) {
    String uuid = payload.replace("\"","");
    lineItemRepository.deleteByuuid(uuid);
    return true;
  }

  @GetMapping(path = "/all")
  public @ResponseBody
  Iterable<LineItem> getItems() {
    return lineItemRepository.findAll();
  }

  @CrossOrigin(origins = "*")
  @PostMapping("/submitdata")
  public String submitdata(@RequestBody String payload) {
    System.out.println(updateLineItems(payload));
    return "server found";
  }

  @RequestMapping(value = "/", method = RequestMethod.GET, produces = {
      MediaType.APPLICATION_JSON_VALUE}, consumes = MediaType.ALL_VALUE)
  public String renderPage(@RequestParam(value = "type", defaultValue = "asset") String type,
      @RequestParam(value = "category", defaultValue = "long_term") String category) {
    List<LineItem> lineItems = (List<LineItem>) lineItemRepository.findAll();

    ObjectMapper mapperObj = new ObjectMapper();

    try {
      return mapperObj.writeValueAsString(lineItems.stream()
          .filter(x -> x.getCategory().toString().toLowerCase().equals(category.toLowerCase()) && x
              .getType().toString().toLowerCase().equals(type.toLowerCase()))
          .toArray());
    } catch (JsonProcessingException e) {
      e.printStackTrace();
      return "";
    }
  }

  @RequestMapping(value = "/getrate", method = RequestMethod.GET, produces = {
      MediaType.APPLICATION_JSON_VALUE}, consumes = MediaType.ALL_VALUE)
  public String getRate(@RequestParam(value = "symbol", defaultValue = "CAD") String symbol) {
    ObjectMapper mapperObj = new ObjectMapper();
    try {
      return mapperObj.writeValueAsString(getRateBySymbol(symbol));
    } catch (JsonProcessingException e) {
      e.printStackTrace();
      return "";
    }
  }

  @RequestMapping(value = "/currencies", method = RequestMethod.GET, produces = {
      MediaType.APPLICATION_JSON_VALUE}, consumes = MediaType.ALL_VALUE)
  public String getcurrencies(){
    ObjectMapper mapperObj = new ObjectMapper();
    try {
      return mapperObj.writeValueAsString(currencyList());
    } catch (JsonProcessingException e) {
      e.printStackTrace();
      return "";
    }
  }

  private Currency getRateBySymbol(String symbol){
    List<Currency> currencies = currencyList();
    String selected = symbol;
    if (selected == null || selected.isEmpty() || selected.trim().equals("")) {
      selected = "cad";
    }
    String finalSelected = selected;
    Currency currency;
    try {
      currency = currencies.stream()
          .filter(x -> x.getSymbol().toLowerCase().equals(finalSelected.toLowerCase()))
          .collect(Collectors.toList()).get(0);
    } catch (IndexOutOfBoundsException e){
      currency = currencies.stream()
          .filter(x -> x.getSymbol().toLowerCase().equals("cad"))
          .collect(Collectors.toList()).get(0);
    }

    return currency;
  }

  private List<Currency> currencyList(){
    ArrayList<Currency> currencies = new ArrayList<Currency>();
    Currency currency1 = new Currency(1, "CAD", 1.0);
    Currency currency2 = new Currency(2, "USD", 1.2);
    currencies.add(currency1);
    currencies.add(currency2);
    return currencies;
  }

  private String updateLineItems(String testStr) {
    List<LineItem> lineItems = null;
    try {
      lineItems = new ObjectMapper().readValue(testStr, new TypeReference<List<LineItem>>() {
      });
    } catch (JsonProcessingException e) {
      e.printStackTrace();
    }
    List<String> uuidList = lineItems.stream().map(x -> x.getUuid()).collect(Collectors.toList());
    List<LineItem> foundItems = lineItemRepository.findByuuidIn(uuidList);
    List<LineItem> updateItems = lineItems.stream()
        .map(x -> {
          for (LineItem y : foundItems) {
            if (y.getUuid().equals(x.getUuid())) {
              x.setId(y.getId());
            }
          }
          return x;
        })
        .collect(Collectors.toList());
    lineItemRepository.saveAll(updateItems);
    return "updated";
  }

  private List<LineItem> createDummyData() {
    double baseValue = 1472.94;
    List<LineItem> lineItems = new ArrayList<>();
    for (int i = 1; i < 6; i++) {
      lineItems.add(
          new LineItem(i, UUID.randomUUID().toString(), Type.ASSET, Category.SHORT_TERM,
              "label " + i,
              (float) (baseValue * i * i)));
    }
    for (int i = 6; i < 11; i++) {
      lineItems.add(
          new LineItem(i, UUID.randomUUID().toString(), Type.ASSET, Category.LONG_TERM,
              "label " + i,
              (float) (baseValue * i * i)));
    }
    for (int i = 11; i < 16; i++) {
      lineItems.add(
          new LineItem(i, UUID.randomUUID().toString(), Type.LIABILITY, Category.SHORT_TERM,
              "label " + i,
              (float) (baseValue * i * i)));
    }
    for (int i = 16; i < 21; i++) {
      lineItems.add(
          new LineItem(i, UUID.randomUUID().toString(), Type.LIABILITY, Category.LONG_TERM,
              "label " + i,
              (float) (baseValue * i * i)));
    }
    return lineItems;
  }
}
