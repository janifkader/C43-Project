package com.c43.portfolio_manager.endpoints;

import java.sql.Date;
import java.util.List;
import java.sql.Date;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.Dailystock;
import com.c43.portfolio_manager.service.StockService;

@RestController
@RequestMapping("/stock")
public class StockEndpoint {
	private final StockService service;
	
	public StockEndpoint (StockService service) {
		this.service = service;
	}
	
	@GetMapping("/")
	public List<String> get(@RequestParam String search) {
		return service.getStocks(search);
	}
	
	@GetMapping("/history/")
	public List<Object[]> getStockHistory(@RequestParam String symbol, @RequestParam Date start_date, @RequestParam Date end_date) {
		return service.getStockHistory(symbol, start_date, end_date);
	}
	
	@PostMapping("/")
	public boolean addDailyStockData(@RequestBody Dailystock ds) {
		System.out.println(ds.timestamp);
		return service.addDailyStockData(ds.timestamp, ds.open, ds.high, ds.low, ds.close, ds.volume, ds.symbol);
	}
}
