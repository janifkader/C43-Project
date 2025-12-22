package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.StockList;
import com.c43.portfolio_manager.model.User;
import com.c43.portfolio_manager.model.SharedStockList;
import com.c43.portfolio_manager.model.Stock;
import com.c43.portfolio_manager.service.StockListService;

@RestController
@RequestMapping("/stocklist")
public class StockListEndpoint {
	private final StockListService service;
	
	public StockListEndpoint(StockListService service) {
		this.service = service;
	}
	
	@PostMapping("/")
	public int create(@CookieValue(value = "user_id", defaultValue = "-1") int user_id, @RequestBody StockList stocklist) {
		return service.createStockList(user_id, stocklist.visibility);
	}
	
	@GetMapping("/")
	public List<StockList> get(@CookieValue(value = "user_id", defaultValue = "-1") int user_id) {
		return service.getStockLists(user_id);
	}
	
	@PutMapping("/")
	public int update(@RequestParam int sl_id, @RequestParam String visibility) {
		return service.updateVisibility(sl_id, visibility);
	}
	
	@PostMapping("/shared/")
	public int share(@RequestParam int sl_id, @RequestParam int user_id) {
		return service.share(sl_id, user_id);
	}
	
	@DeleteMapping("/shared/")
	public int unshare(@RequestParam int sl_id, @RequestParam int user_id) {
		return service.unshare(sl_id, user_id);
	}
	
	@GetMapping("/shared/")
	public List<SharedStockList> getShared(@CookieValue(value = "user_id", defaultValue = "-1") int user_id) {
		return service.getSharedStockLists(user_id);
	}
	
	@GetMapping("/sl/")
	public StockList getOne(@RequestParam int sl_id) {
		return service.getStockList(sl_id);
	}
	
	@PostMapping("/contains/")
	public int insertStock(@RequestBody Stock stock) {
		return service.insertStock(stock.id, stock.symbol, stock.num_of_shares);
	}
	
	@DeleteMapping("/contains/")
	public int deleteStock(@RequestParam int sl_id, @RequestParam String symbol ) {
		return service.deleteStock(sl_id, symbol);
	}
	
	@GetMapping("/contains/")
	public List<Stock> getStocks(@RequestParam int sl_id) {
		return service.getStockListStocks(sl_id);
	}
	
	@DeleteMapping("/")
	public int delete(@RequestParam int sl_id) {
		return service.deleteStockList(sl_id);
	}
	
	@GetMapping("/shared/{sl_id}/")
	public List<User> getSharedWith(@PathVariable int sl_id) {
		return service.getShared(sl_id);
	}
}
