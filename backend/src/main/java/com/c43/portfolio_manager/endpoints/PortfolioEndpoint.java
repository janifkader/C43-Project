package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.service.PortfolioService;
import com.c43.portfolio_manager.model.Portfolio;

@RestController
@RequestMapping("/portfolio")
public class PortfolioEndpoint {
    private final PortfolioService service;
    
    public PortfolioEndpoint(PortfolioService service) {
        this.service = service;
    }
    
    @PostMapping("/create")
    public int createPortfolio(@RequestParam int user_id, @RequestParam double cash_amt) {
        return service.createPortfolio(user_id, cash_amt);
    }
    
    @GetMapping("/user")
    public List<Portfolio> getPortfolios(@RequestParam int user_id) {
        return service.getPortfolios(user_id);
    }
    
    @GetMapping("/{port_id}")
    public Portfolio getPortfolio(@PathVariable int port_id) {
        return service.getPortfolio(port_id);
    }
    
    @PostMapping("/add-stock")
    public boolean addStock(@RequestParam String symbol, @RequestParam int port_id, @RequestParam int num_of_shares) {
        return service.createStockHoldings(symbol, port_id, num_of_shares);
    }
    
    @GetMapping("/holdings/{port_id}")
    public List<Object[]> getStockHoldings(@PathVariable int port_id) {
        return service.getStockHoldings(port_id);
    }
    
    @PutMapping("/update-cash")
    public boolean updateCash(@RequestParam int port_id, @RequestParam double new_cash_amt) {
        return service.updateCash(port_id, new_cash_amt);
    }
}
