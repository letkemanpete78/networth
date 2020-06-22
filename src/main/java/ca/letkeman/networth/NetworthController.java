package ca.letkeman.networth;

import ca.letkeman.networth.dto.LineItemRepository;
import ca.letkeman.networth.model.Category;
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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
public class NetworthController {

  @Autowired
  private LineItemRepository lineItemRepository;

  @GetMapping(path = "/add")
  public @ResponseBody
  String addItem() {
    String testStr = "[{\"uuid\":\"6babeba9-bcaf-49dd-b255-cd3178bc9e38\",\"type\":\"ASSET\",\"category\":\"SHORT_TERM\",\"label\":\"label 1\",\"value\":\"1472.94\"},{\"uuid\":\"4599a26d-6318-482a-afcd-876b98c9090e\",\"type\":\"ASSET\",\"category\":\"SHORT_TERM\",\"label\":\"label 2\",\"value\":\"5891.76\"},{\"uuid\":\"276d8bf4-781f-4a56-91c2-31fed7cf07d5\",\"type\":\"ASSET\",\"category\":\"SHORT_TERM\",\"label\":\"label 3\",\"value\":\"13256.46\"},{\"uuid\":\"988dbf94-e4df-4974-a34f-a96545a244b8\",\"type\":\"ASSET\",\"category\":\"SHORT_TERM\",\"label\":\"label 4\",\"value\":\"23567.04\"},{\"uuid\":\"f0bcaba8-9f6e-485e-ae46-9f5eb2f239b3\",\"type\":\"ASSET\",\"category\":\"SHORT_TERM\",\"label\":\"label 5\",\"value\":\"36823.50\"},{\"uuid\":\"8d1db39f-1503-4c90-a99d-41a27dc45b23\",\"type\":\"ASSET\",\"category\":\"LONG_TERM\",\"label\":\"label 6\",\"value\":\"53025.84\"},{\"uuid\":\"7d5f991e-ef61-43a5-9ad5-87ea2555c424\",\"type\":\"ASSET\",\"category\":\"LONG_TERM\",\"label\":\"label 7\",\"value\":\"72174.06\"},{\"uuid\":\"555bc542-a695-45cb-91fc-558947ccb4f9\",\"type\":\"ASSET\",\"category\":\"LONG_TERM\",\"label\":\"label 8\",\"value\":\"94268.16\"},{\"uuid\":\"6e7e8d86-6018-460f-bc22-849397b38792\",\"type\":\"ASSET\",\"category\":\"LONG_TERM\",\"label\":\"label 9\",\"value\":\"119308.14\"},{\"uuid\":\"53a027eb-6fed-4f2d-91d6-2329f7b23c39\",\"type\":\"ASSET\",\"category\":\"LONG_TERM\",\"label\":\"label 10\",\"value\":\"147294.00\"},{\"uuid\":\"0d08d76b-e3d6-4888-bdc9-acae4d657a3d\",\"type\":\"LIABILITY\",\"category\":\"SHORT_TERM\",\"label\":\"label 11\",\"value\":\"178225.73\"},{\"uuid\":\"fe4de36e-3407-415f-873c-a1bd69399980\",\"type\":\"LIABILITY\",\"category\":\"SHORT_TERM\",\"label\":\"label 12\",\"value\":\"212103.36\"},{\"uuid\":\"b7fec00e-db45-48da-8f22-e53b5d73eca0\",\"type\":\"LIABILITY\",\"category\":\"SHORT_TERM\",\"label\":\"label 13\",\"value\":\"248926.86\"},{\"uuid\":\"5e1ccf00-fb13-4a11-a7ae-9306d89ebb4d\",\"type\":\"LIABILITY\",\"category\":\"SHORT_TERM\",\"label\":\"label 14\",\"value\":\"288696.25\"},{\"uuid\":\"8a1dc0e3-5d59-4eaa-989b-21f901fc4d44\",\"type\":\"LIABILITY\",\"category\":\"SHORT_TERM\",\"label\":\"label 15\",\"value\":\"331411.50\"},{\"uuid\":\"7666bea0-1567-4a47-83ba-934b31eeb93b\",\"type\":\"LIABILITY\",\"category\":\"LONG_TERM\",\"label\":\"label 16\",\"value\":\"377072.62\"},{\"uuid\":\"986ddfbb-ff21-4aa3-a96a-356acc0d37b8\",\"type\":\"LIABILITY\",\"category\":\"LONG_TERM\",\"label\":\"label 17\",\"value\":\"425679.66\"},{\"uuid\":\"0f242d9e-dced-4bd7-af0a-709cd2a88638\",\"type\":\"LIABILITY\",\"category\":\"LONG_TERM\",\"label\":\"label 18\",\"value\":\"477232.56\"},{\"uuid\":\"ddef55c8-3741-45fa-88e0-ec9443a14e6a\",\"type\":\"LIABILITY\",\"category\":\"LONG_TERM\",\"label\":\"label 19\",\"value\":\"531731.30\"},{\"uuid\":\"e721bccf-5e39-40ae-8a93-7101f8be192f\",\"type\":\"LIABILITY\",\"category\":\"LONG_TERM\",\"label\":\"label 20\",\"value\":\"589176.00\"}]";
    String status = updateLineItems(testStr);
    return status;
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

  @GetMapping(path = "/all")
  public @ResponseBody
  Iterable<LineItem> getItems() {
    return lineItemRepository.findAll();
  }

  @CrossOrigin(origins = "*")
  @PostMapping("/submitdata")
  public String submitdata(@RequestBody String payload) {
    System.out.println(payload);
    System.out.println(updateLineItems(payload));
    return "server found";
  }

  @RequestMapping(value = "/", method = RequestMethod.GET, produces = {
      MediaType.APPLICATION_JSON_VALUE}, consumes = MediaType.ALL_VALUE)
  public String renderPage(@RequestParam(value = "type", defaultValue = "asset") String type,
      @RequestParam(value = "category", defaultValue = "long_term") String category) {
//    List<LineItem> lineItems = createDummyData();
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
