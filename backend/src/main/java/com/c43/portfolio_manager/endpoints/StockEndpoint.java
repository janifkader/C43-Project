package com.c43.portfolio_manager.endpoints;

import java.sql.Date;
import java.util.List;
import java.sql.Date;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.Dailystock;
import com.c43.portfolio_manager.model.DailystockRequest;
import com.c43.portfolio_manager.service.StockService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

@RestController
@RequestMapping("/stock")
public class StockEndpoint {
	private final StockService service;
	
	public StockEndpoint (StockService service) {
		this.service = service;
	}
	
	@GetMapping("/")
	public List<String> get(
			@RequestParam 
			@NotBlank(message = "Search cannot be empty")
			@Pattern(regexp = "^[a-zA-Z]+$", message = "Search can only contain letters")
			String search) {
		return service.getStocks(search);
	}
	
	@GetMapping("/history/")
	public List<Object[]> getStockHistory(
			@RequestParam 
		    @NotBlank(message = "Symbol cannot be empty")
		    @Pattern(regexp = "^[A-Z]{1,5}$", message = "Symbol must be 1-5 uppercase letters")
			String symbol, 
			
			@RequestParam
			Date start_date, 
			
			@RequestParam
			Date end_date) {
		return service.getStockHistory(symbol, start_date, end_date);
	}
	
	@PostMapping("/")
	public boolean addDailyStockData(@Valid @RequestBody DailystockRequest ds) {
		return service.addDailyStockData(new Date(System.currentTimeMillis()), ds.open, ds.high, ds.low, ds.close, ds.volume, ds.symbol);
	}
	
	@GetMapping("/predict/")
	public List<Object[]> predictFuturePrices(
			@RequestParam 
			@NotBlank(message = "Symbol cannot be empty")
		    @Pattern(regexp = "^[A-Z]{1,5}$", message = "Symbol must be 1-5 uppercase letters")
			String symbol, 
			
			@RequestParam 
			@Min(value = 1, message = "Days must be positive") 
			int days_to_predict) {
	    return service.predictFuturePrices(symbol, days_to_predict);
	}
}
