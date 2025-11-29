package com.c43.portfolio_manager.endpoints;

import java.util.List;
import java.sql.Date;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.service.StockService;

@RestController
@RequestMapping("/stock")
public class StockEndpoint {
    private final StockService service;
    
    public StockEndpoint(StockService service) {
        this.service = service;
    }
    
    @GetMapping("/search")
    public List<String> searchStocks(@RequestParam String search) {
        return service.getStocks(search);
    }
    
    @GetMapping("/price/{symbol}")
    public double getCurrentPrice(@PathVariable String symbol) {
        return service.getCurrentPrice(symbol);
    }
    
    @GetMapping("/history")
    public List<Object[]> getStockHistory(@RequestParam String symbol, @RequestParam Date start_date, @RequestParam Date end_date) {
        return service.getStockHistory(symbol, start_date, end_date);
    }
    
    @PostMapping("/add-data")
    public boolean addDailyStockData(@RequestParam String symbol, @RequestParam Date timestamp, @RequestParam double open, @RequestParam double high, @RequestParam double low, @RequestParam double close, @RequestParam long volume) {
        return service.addDailyStockData(symbol, timestamp, open, high, low, close, volume);
    }
}