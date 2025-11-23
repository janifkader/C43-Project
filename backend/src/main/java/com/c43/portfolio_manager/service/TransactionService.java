package com.c43.portfolio_manager.service;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.model.Transaction;
import com.c43.portfolio_manager.repository.TransactionRepo;

@Service
public class TransactionService {
	
	private TransactionRepo repo = new TransactionRepo();
	
	public int createTransaction(String symbol, int port_id, String type, int amount, double unit_cost, Date date) {
		return repo.createTransaction(symbol, port_id, type, amount, unit_cost, date);
	}
	
	public List<Transaction> getTransactions(int port_id) {
		return repo.getTransactions(port_id);
	}
}
