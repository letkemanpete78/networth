package ca.letkeman.networth.model;

import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.builder.ToStringBuilder;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class LineItem {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Integer id;
  private String uuid;
  private Type type;
  private Category category;
  private String label;
  private float value;


  public LineItem() {
  }

  public LineItem(Integer id,String uuid, Type type, Category category, String label, float value) {
    this.id = id;
    this.uuid = uuid;
    this.type = type;
    this.category = category;
    this.label = label;
    this.value = value;
  }


  public static float sumLiabilities(List<LineItem> lineItems) {
    return sumLineItems(
        lineItems.stream().filter(x -> x.type.equals(Type.LIABILITY)).collect(Collectors.toList()),
        Type.LIABILITY);
  }

  public static float sumAssets(List<LineItem> lineItems) {
    return sumLineItems(
        lineItems.stream().filter(x -> x.type.equals(Type.ASSET)).collect(Collectors.toList()),
        Type.ASSET);
  }

  private static float sumLineItems(List<LineItem> lineItems, Type type) {
    float retval = 0;
    for (LineItem lineItem : lineItems) {
      retval += lineItem.value;
    }
    return retval;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getUuid() {
    return uuid;
  }

  public void setUuid(String uuid) {
    this.uuid = uuid;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public Category getCategory() {
    return category;
  }

  public void setCategory(Category category) {
    this.category = category;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public float getValue() {
    return value;
  }

  public void setValue(float value) {
    this.value = value;
  }


  @Override
  public boolean equals(Object obj) {
    if (obj == null) {
      return false;
    }
    if (obj == this) {
      return true;
    }
    if (obj.getClass() != getClass()) {
      return false;
    }
    LineItem rhs = (LineItem) obj;
    return new org.apache.commons.lang3.builder.EqualsBuilder()
        .append(this.uuid, rhs.uuid)
        .append(this.type, rhs.type)
        .append(this.category, rhs.category)
        .append(this.label, rhs.label)
        .append(this.value, rhs.value)
        .isEquals();
  }

  @Override
  public int hashCode() {
    return new org.apache.commons.lang3.builder.HashCodeBuilder()
        .append(uuid)
        .append(type)
        .append(category)
        .append(label)
        .append(value)
        .toHashCode();
  }

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("id",id)
        .append("uuid", uuid)
        .append("type", type)
        .append("category", category)
        .append("label", label)
        .append("value", value)
        .toString();
  }


}
