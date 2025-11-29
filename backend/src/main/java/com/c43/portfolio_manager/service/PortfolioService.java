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
	
	public int updatePortfolio(int port_id, double cash_amt) {
		return repo.updatePortfolio(port_id, cash_amt);
	}
	
	public List<Stock> getStockHoldings(int port_id) {
		return repo.getStockHoldings(port_id);
	}
	
	public int createStockHoldings(int port_id, String symbol, int num_of_shares) {
		return repo.createStockHoldings(port_id, symbol, num_of_shares);
	}
	
	public int sellStock(int port_id, String symbol, int num_of_shares, double price) {
		return repo.sellStock(port_id, symbol, num_of_shares, price);
	}
}
