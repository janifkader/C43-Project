package com.c43.portfolio_manager.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.c43.portfolio_manager.Database;
import com.c43.portfolio_manager.model.Dailystock;
import com.c43.portfolio_manager.model.Stock;
import com.c43.portfolio_manager.repository.PortfolioRepo;
import com.c43.portfolio_manager.repository.StockRepo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class StockMarketService {

    private final String API_KEY = "d4l5phhr01qt7v18mffgd4l5phhr01qt7v18mfg0"; 
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private final StockRepo stockRepo = new StockRepo();

    public BigDecimal getPrice(String symbol) {

        String url = "https://finnhub.io/api/v1/quote?symbol=" 
                     + symbol.toUpperCase() + "&token=" + API_KEY;

        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);
            
            JsonNode root = mapper.readTree(jsonResponse);

            if (root.has("c") && !root.path("c").isNull()) {
                double price = root.path("c").asDouble();

                if (price == 0) {
                    System.out.println("Symbol not found or price is 0: " + symbol);
                    return BigDecimal.valueOf(stockRepo.getCurrentPrice(symbol));
                }
                
                return BigDecimal.valueOf(price);
            }
            
            System.out.println("Invalid response for symbol: " + symbol);
            return BigDecimal.valueOf(stockRepo.getCurrentPrice(symbol));

        } catch (Exception e) {
            System.out.println("Error fetching data for " + symbol + ": " + e.getMessage());
            return BigDecimal.valueOf(stockRepo.getCurrentPrice(symbol));
        }
    }
    
    public List<Dailystock> refreshPortfolioPrices(int port_id) {
    	PortfolioRepo port = new PortfolioRepo();
        List<Stock> stocks = port.getStockHoldings(port_id);
        List<Dailystock> daily = new ArrayList<>();

        for (Stock s : stocks) {
            String symbol = s.symbol;
            int timestamp = 0;
            double open = 0;
            double high = 0;
            double low = 0;
            double close = 0;
            int volume = 0;
            String url = "https://finnhub.io/api/v1/quote?symbol=" + symbol.toUpperCase() + "&token=" + API_KEY;

	       try {
	           String jsonResponse = restTemplate.getForObject(url, String.class);
	           
	           JsonNode root = mapper.readTree(jsonResponse);
	           
	
	           if (root.has("c") && !root.path("c").isNull()) {
	               close = root.path("c").asDouble();
	               if (close == 0) {
	                   System.out.println("Symbol not found or price is 0: " + symbol);
	                   continue;
	               }
	           }
	           if (root.has("h") && !root.path("h").isNull()) {
	               high = root.path("h").asDouble();
	               if (high == 0) {
	                   System.out.println("Symbol not found or price is 0: " + symbol);
	                   continue;
	               }
	           }
	           if (root.has("l") && !root.path("l").isNull()) {
	               low = root.path("l").asDouble();
	               if (low == 0) {
	                   System.out.println("Symbol not found or price is 0: " + symbol);
	                   continue;
	               }
	           }
	           if (root.has("o") && !root.path("o").isNull()) {
	               open = root.path("o").asDouble();
	               if (open == 0) {
	                   System.out.println("Symbol not found or price is 0: " + symbol);
	                   continue;
	               }
	           }
	           if (root.has("t") && !root.path("t").isNull()) {
	               timestamp = root.path("t").asInt();
	               if (timestamp == 0) {
	                   System.out.println("Symbol not found or price is 0: " + symbol);
	                   continue;
	               }
	           }
	           daily.add(new Dailystock(new Date(timestamp * 1000L), open, high, low, close, volume, symbol));
	       } 
	       catch (Exception e) {
	           System.out.println("Error fetching data for " + symbol + ": " + e.getMessage());
	       }
        }
        return daily;
    }
}