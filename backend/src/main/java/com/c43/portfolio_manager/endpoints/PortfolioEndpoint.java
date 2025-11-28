package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.service.PortfolioService;
import com.c43.portfolio_manager.model.Portfolio;
import com.c43.portfolio_manager.model.Stock;

@RestController
@RequestMapping("/portfolios")
public class PortfolioEndpoint {
	private final PortfolioService service;
	
	public PortfolioEndpoint(PortfolioService service) {
		System.out.println("FUCK MED ADDYA");
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
	
	@PostMapping("/portfolio/")
	public int update(@RequestBody Portfolio port) {
		return service.updatePortfolio(port.port_id, port.cash_amt);
	}
	
	@GetMapping("/portfolio/")
	public Portfolio getOne(@RequestParam int port_id) {
		return service.getPortfolio(port_id);
	}
	
	@PostMapping("/holdings/")
	public int insertStock(@RequestBody Stock stock ) {
		return service.insertStock(stock.id, stock.symbol, stock.num_of_shares);
	}
	
	@GetMapping("/holdings/")
	public List<Stock> getStocks(@RequestParam int port_id) {
		return service.getStockHoldings(port_id);
	}
}
