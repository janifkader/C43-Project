package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.service.PortfolioService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import com.c43.portfolio_manager.model.Portfolio;
import com.c43.portfolio_manager.model.Stock;
import jakarta.validation.*;
import jakarta.validation.constraints.*;

@RestController
@RequestMapping("/portfolio")
public class PortfolioEndpoint {
    private final PortfolioService service;
    
    public PortfolioEndpoint(PortfolioService service) {
        this.service = service;
    }
    
    @PostMapping("/")
    public int createPortfolio(@CookieValue(value = "user_id", defaultValue = "-1") int user_id, @Valid @RequestBody Portfolio port) {
        return service.createPortfolio(user_id, port.cash_amt);
    }
    
    @GetMapping("/")
    public List<Portfolio> getPortfolios(@CookieValue(value = "user_id", defaultValue = "-1") int user_id) {
        return service.getPortfolios(user_id);
    }
    
    @GetMapping("/{port_id}")
    public Portfolio getPortfolio(@PathVariable @Min(value = 1, message = "Portfolio ID must be positive") int port_id) {
        return service.getPortfolio(port_id);
    }
    
    @PostMapping("/add-stock/")
    public int addStock(@Valid @RequestBody Stock stock) {
        return service.createStockHoldings(stock.id, stock.symbol, stock.num_of_shares);
    }
    
    @GetMapping("/holdings/{port_id}")
    public List<Stock> getStockHoldings(@PathVariable @Min(value = 1, message = "Portfolio ID must be positive") int port_id) {
        return service.getStockHoldings(port_id);
    }
    
    @PostMapping("/sell/")
    public int sell(@Valid @RequestBody Stock stock, @RequestParam @Min(value = 1, message = "Price must be positive") double price) {
    	return service.sellStock(stock.id, stock.symbol, stock.num_of_shares, price);
    }
    
    @PutMapping("/")
    public int updateCash(@Valid @RequestBody Portfolio port) {
        return service.updatePortfolio(port.port_id, port.cash_amt);
    }
}
