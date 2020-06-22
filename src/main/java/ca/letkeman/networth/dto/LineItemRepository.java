package ca.letkeman.networth.dto;

import ca.letkeman.networth.model.LineItem;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface LineItemRepository extends CrudRepository<LineItem, Integer> {

  List<LineItem> findByuuidIn(List<String> strings);

}
