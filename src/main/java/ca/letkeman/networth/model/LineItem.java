package ca.letkeman.networth.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.mapping.ToOne;

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
  @OneToOne
  private Currency currency;

  public LineItem() {
  }

  public LineItem(Integer id,String uuid, Type type, Category category, String label, float value, Currency currency) {
    this.id = id;
    this.uuid = uuid;
    this.type = type;
    this.category = category;
    this.label = label;
    this.value = value;
    this.currency = currency;
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

  public Currency getCurrency() {
    return currency;
  }

  public void setCurrency(Currency currency) {
    this.currency = currency;
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
        .append(this.currency, rhs.currency)
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
        .append(currency)
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
        .append("currency",currency)
        .toString();
  }


}
