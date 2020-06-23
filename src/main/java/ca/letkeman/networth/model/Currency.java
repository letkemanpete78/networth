package ca.letkeman.networth.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

@Entity
public class Currency {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Integer id;
  private String symbol;
  private double rate;

  public Currency() {
  }

  public Currency(Integer id, String symbol, double rate) {
    this.id = id;
    setSymbol(symbol);
    setRate(rate);
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getSymbol() {
    return symbol;
  }

  public void setSymbol(String symbol) {
    if (symbol == null || symbol.isEmpty()) {
      this.symbol = "CAD";
    } else {
      this.symbol = symbol;
    }
  }

  public double getRate() {
    return rate;
  }

  public void setRate(double rate) {
    if (rate < 0) {
      this.rate = 1;
    } else {
      this.rate = rate;
    }
  }

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("id", id)
        .append("symbol", symbol)
        .append("rate", rate)
        .toString();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Currency currency = (Currency) o;

    return new EqualsBuilder()
        .append(rate, currency.rate)
        .append(symbol, currency.symbol)
        .isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37)
        .append(symbol)
        .append(rate)
        .toHashCode();
  }
}
