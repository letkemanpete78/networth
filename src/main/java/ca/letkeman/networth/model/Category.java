package ca.letkeman.networth.model;


public enum Category {
  SHORT_TERM("short_term"),
  LONG_TERM("long_term");

  private final String label;

  Category(String s) {
    label = s;
  }


  @Override
  public String toString() {
    return label;
  }
}
