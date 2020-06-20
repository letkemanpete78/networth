package ca.letkeman.networth;

import ca.letkeman.networth.model.Category;
import ca.letkeman.networth.model.LineItem;
import ca.letkeman.networth.model.Type;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(maxAge = 3600)
@RestController
public class NetworthController {

  @GetMapping("/calcnetworth")
  public float calcNetworth(
      @RequestParam(value = "lineItems[]") List<LineItem> lineItems) {
    return LineItem.calcNetworth(
        lineItems);
  }

  @RequestMapping(value = "/", method = RequestMethod.GET, produces = {
      MediaType.APPLICATION_JSON_VALUE}, consumes = MediaType.ALL_VALUE)
  public String renderPage(@RequestParam(value = "type", defaultValue = "asset") String type,
      @RequestParam(value = "category", defaultValue = "long_term") String category) {
    List<LineItem> lineItems = createDummyData();

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
    List<LineItem> lineItems = new ArrayList<>();
    for (int i = 1; i < 6; i++) {
      lineItems.add(
          new LineItem(UUID.randomUUID().toString(), Type.ASSET, Category.SHORT_TERM, "label " + i,
              (float) (10.01 * i)));
    }
    for (int i = 6; i < 11; i++) {
      lineItems.add(
          new LineItem(UUID.randomUUID().toString(), Type.ASSET, Category.LONG_TERM, "label " + i,
              (float) (10.01 * i)));
    }
    for (int i = 11; i < 16; i++) {
      lineItems.add(
          new LineItem(UUID.randomUUID().toString(), Type.LIABILITY, Category.SHORT_TERM,
              "label " + i,
              (float) (10.01 * i)));
    }
    for (int i = 16; i < 21; i++) {
      lineItems.add(
          new LineItem(UUID.randomUUID().toString(), Type.LIABILITY, Category.LONG_TERM,
              "label " + i,
              (float) (10.01 * i)));
    }
    return lineItems;
  }
}
