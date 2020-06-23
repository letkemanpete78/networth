package ca.letkeman.networth.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import org.apache.commons.lang3.builder.ToStringBuilder;

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
