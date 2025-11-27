package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.service.StockService;

@RestController
@RequestMapping("/stocks")
public class StockEndpoint {
	private final StockService service;
	
	public StockEndpoint (StockService service) {
		this.service = service;
	}
	
	@GetMapping("/")
	public List<String> get(@RequestParam String search) {
		return service.getStocks(search);
	}
}
