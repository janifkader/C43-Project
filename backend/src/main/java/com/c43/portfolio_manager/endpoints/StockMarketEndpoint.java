package com.c43.portfolio_manager.endpoints;

import java.math.BigDecimal;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.service.StockMarketService;

@RestController
@RequestMapping("/price")
public class StockMarketEndpoint {
	private final StockMarketService service;
	
	public StockMarketEndpoint(StockMarketService service) {
		this.service = service;
	}
	
	@GetMapping("/")
	public BigDecimal get(@RequestParam String symbol) {
		return service.getPrice(symbol);
	}
}
