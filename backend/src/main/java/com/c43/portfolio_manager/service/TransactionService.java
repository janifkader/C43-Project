package com.c43.portfolio_manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.model.Transaction;
import com.c43.portfolio_manager.repository.TransactionRepo;

@Service
public class TransactionService {
    private TransactionRepo repo = new TransactionRepo();
    
    public int createTransaction(String symbol, int port_id, String type, int amount, double unit_cost) {
        return repo.createTransaction(symbol, port_id, type, amount, unit_cost);
    }
    
    public List<Transaction> getTransactions(int port_id) {
        return repo.getTransactions(port_id);
    }
    
    public List<Transaction> getTransactionHistory(int port_id, String symbol) {
        return repo.getTransactionHistory(port_id, symbol);
    }
}
