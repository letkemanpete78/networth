package ca.letkeman.networth.model;

import java.util.List;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class Networth {
  private String uuid;
  private List<LineItem> lineItems;

  public Networth() {
  }

  public Networth(String uuid, List<LineItem> lineItems) {
    this.uuid = uuid;
    this.lineItems = lineItems;
  }

  public String getUuid() {
    return uuid;
  }

  public void setUuid(String uuid) {
    this.uuid = uuid;
  }

  public List<LineItem> getLineItems() {
    return lineItems;
  }

  public void setLineItems(List<LineItem> lineItems) {
    this.lineItems = lineItems;
  }

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("uuid", uuid)
        .append("lineItems", lineItems)
        .toString();
  }
}
