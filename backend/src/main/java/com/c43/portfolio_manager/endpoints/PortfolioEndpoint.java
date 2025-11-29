package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.service.PortfolioService;
import com.c43.portfolio_manager.model.Portfolio;
import com.c43.portfolio_manager.model.Stock;

@RestController
@RequestMapping("/portfolio")
public class PortfolioEndpoint {
    private final PortfolioService service;
    
    public PortfolioEndpoint(PortfolioService service) {
        this.service = service;
    }
    
    @PostMapping("/")
    public int createPortfolio(@RequestBody Portfolio port) {
        return service.createPortfolio(port.user_id, port.cash_amt);
    }
    
    @GetMapping("/")
    public List<Portfolio> getPortfolios(@RequestParam int user_id) {
        return service.getPortfolios(user_id);
    }
    
    @GetMapping("/{port_id}")
    public Portfolio getPortfolio(@PathVariable int port_id) {
        return service.getPortfolio(port_id);
    }
    
    @PostMapping("/add-stock/")
    public int addStock(@RequestBody Stock stock) {
        return service.createStockHoldings(stock.id, stock.symbol, stock.num_of_shares);
    }
    
    @GetMapping("/holdings/{port_id}")
    public List<Stock> getStockHoldings(@PathVariable int port_id) {
        return service.getStockHoldings(port_id);
    }
    
    @PostMapping("/sell/")
    public int sell(@RequestBody Stock stock, @RequestParam double price) {
    	return service.sellStock(stock.id, stock.symbol, stock.num_of_shares, price);
    }
    
    @PutMapping("/")
    public int updateCash(@RequestBody Portfolio port) {
        return service.updatePortfolio(port.port_id, port.cash_amt);
    }
}