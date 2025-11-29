package com.c43.portfolio_manager.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;

@Service
public class StockMarketService {

    private final String API_KEY = "BRJKF3A48SLRBCWE";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public BigDecimal getPrice(String symbol) {
        String url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" 
                     + symbol + "&apikey=" + API_KEY;

        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);

            JsonNode root = mapper.readTree(jsonResponse);
            
            JsonNode quote = root.path("Global Quote");
            
            if (quote.isMissingNode()) {
                System.out.println("Error fetching data for " + symbol);
                System.out.println("QUOTE: " + quote);
                System.out.println("JSON: " + jsonResponse);
                System.out.println("STRING: " + url);
                return BigDecimal.ZERO;
            }

            String priceString = quote.path("05. price").asText();
            return new BigDecimal(priceString);

        } catch (Exception e) {
            e.printStackTrace();
            return BigDecimal.ZERO;
        }
    }
}