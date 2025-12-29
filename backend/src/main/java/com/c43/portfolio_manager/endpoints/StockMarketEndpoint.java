package com.c43.portfolio_manager.endpoints;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.Dailystock;
import com.c43.portfolio_manager.service.StockMarketService;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@RestController
@RequestMapping("/price")
public class StockMarketEndpoint {
	private final StockMarketService service;
	
	public StockMarketEndpoint(StockMarketService service) {
		this.service = service;
	}
	
	@GetMapping("/")
	public BigDecimal get(
			@RequestParam 
			@NotBlank(message = "Symbol cannot be empty")
		    @Pattern(regexp = "^[A-Z]{1,5}$", message = "Symbol must be 1-5 uppercase letters")
			String symbol) {
		return service.getPrice(symbol);
	}
	
	@GetMapping("/all/")
	public List<Dailystock> refreshPortfolioPrices(@RequestParam @Min(value = 1, message = "Port ID must be positive")  int port_id) {
		return service.refreshPortfolioPrices(port_id);
	}
}
