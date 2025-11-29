package com.c43.portfolio_manager.endpoints;

import java.sql.Date;
import java.util.List;
import java.sql.Date;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.Dailystock;
import com.c43.portfolio_manager.model.DailystockRequest;
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
	public boolean addDailyStockData(@RequestParam double open, @RequestParam double high, @RequestParam double low ,@RequestParam double close, @RequestParam int volume, @RequestParam String symbol) {
		return service.addDailyStockData(new Date(System.currentTimeMillis()), open, high, low, close, volume, symbol);
	}
	
	@GetMapping("/predict/")
	public List<Object[]> predictFuturePrices(@RequestParam String symbol, @RequestParam int days_to_predict) {
	    return service.predictFuturePrices(symbol, days_to_predict);
	}
}
