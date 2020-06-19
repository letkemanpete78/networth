package ca.letkeman.networth;

import ca.letkeman.networth.model.LineItem;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NetworthController {

  @GetMapping("/calcnetworth")
  public float calcNetworth(
      @RequestParam(value = "lineItems[]") List<LineItem> lineItems) {
    return LineItem.calcNetworth(
        lineItems);
  }

//  @GetMapping("/")
//  public String renderPage(){
//
//  }
}
