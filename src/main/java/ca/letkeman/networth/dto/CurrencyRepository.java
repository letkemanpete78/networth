package ca.letkeman.networth.dto;


import ca.letkeman.networth.model.Currency;
import org.springframework.data.repository.CrudRepository;
public interface CurrencyRepository extends CrudRepository<Currency, Integer> {

  Currency findBySymbol(String s);
}
