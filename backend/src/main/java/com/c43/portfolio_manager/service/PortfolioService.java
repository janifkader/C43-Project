package com.c43.portfolio_manager.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.model.Portfolio;
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
}
