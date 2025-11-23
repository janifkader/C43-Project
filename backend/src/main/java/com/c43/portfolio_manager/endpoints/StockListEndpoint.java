package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.StockList;
import com.c43.portfolio_manager.service.StockListService;

@RestController
@RequestMapping("/stocklist")
public class StockListEndpoint {
	private final StockListService service;
	
	public StockListEndpoint(StockListService service) {
		this.service = service;
	}
	
	@PostMapping("/")
	public int create(@RequestBody StockList stocklist) {
		return service.createStockList(stocklist.user_id, stocklist.visibility);
	}
	
	@GetMapping("/")
	public List<StockList> get(@RequestParam int user_id) {
		return service.getStockLists(user_id);
	}
}
