package com.c43.portfolio_manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.model.Portfolio;
import com.c43.portfolio_manager.model.Stock;
import com.c43.portfolio_manager.repository.PortfolioRepo;

@Service
public class PortfolioService {
    private PortfolioRepo repo = new PortfolioRepo();
    
    public int createPortfolio(int user_id, double cash_amt) {
        return repo.createPortfolio(user_id, cash_amt);
    }
    
    public List<Portfolio> getPortfolios(int user_id) {
        return repo.getPortfolios(user_id);
    }
    
    public Portfolio getPortfolio(int port_id) {
        return repo.getPortfolio(port_id);
    }
    
    public boolean createStockHoldings(String symbol, int port_id, int num_of_shares) {
        return repo.createStockHoldings(symbol, port_id, num_of_shares);
    }
    
    public List<Object[]> getStockHoldings(int port_id) {
        return repo.getStockHoldings(port_id);
    }
    
    public boolean updateCash(int port_id, double new_cash_amt) {
        return repo.updateCash(port_id, new_cash_amt);
    }
}
