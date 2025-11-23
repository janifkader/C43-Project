package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.service.PortfolioService;
import com.c43.portfolio_manager.model.Portfolio;

@RestController
@RequestMapping("/portfolios")
public class PortfolioEndpoint {
	private final PortfolioService service;
	
	public PortfolioEndpoint(PortfolioService service) {
		this.service = service;
	}
	
	@PostMapping("/")
	public int create(@RequestBody Portfolio port) {
		return service.createPortfolio(port.user_id, port.cash_amt);
	}
	
	@GetMapping("/")
	public List<Portfolio> get(@RequestParam int user_id){
		return service.getPortfolios(user_id);
	}
}
