package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.Transaction;
import com.c43.portfolio_manager.service.TransactionService;

@RestController
@RequestMapping("/transaction")
public class TransactionEndpoint {
    private final TransactionService service;
    
    public TransactionEndpoint(TransactionService service) {
        this.service = service;
    }
    
    @PostMapping("/")
    public int createTransaction(@RequestBody Transaction trans) {
        return service.createTransaction(trans.symbol, trans.port_id, trans.type, trans.amount, trans.unit_cost);
    }
    
    @GetMapping("/{port_id}")
    public List<Transaction> getTransactions(@PathVariable int port_id) {
        return service.getTransactions(port_id);
    }
    
    @GetMapping("/history")
    public List<Transaction> getTransactionHistory(@RequestParam int port_id, @RequestParam String symbol) {
        return service.getTransactionHistory(port_id, symbol);
    }
}