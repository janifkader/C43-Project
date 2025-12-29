package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.Transaction;
import com.c43.portfolio_manager.service.TransactionService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@RestController
@RequestMapping("/transaction")
public class TransactionEndpoint {
    private final TransactionService service;
    
    public TransactionEndpoint(TransactionService service) {
        this.service = service;
    }
    
    @PostMapping("/")
    public int createTransaction(@Valid @RequestBody Transaction trans) {
        return service.createTransaction(trans.symbol, trans.port_id, trans.type, trans.amount, trans.unit_cost);
    }
    
    @GetMapping("/{port_id}")
    public List<Transaction> getTransactions(@PathVariable @Min(value = 1, message = "Port ID must be positive") int port_id) {
        return service.getTransactions(port_id);
    }
    
    @GetMapping("/history")
    public List<Transaction> getTransactionHistory(
    		@RequestParam 
    		@Min(value = 1, message = "Port ID must be positive") 
    		int port_id, 
    		@RequestParam 
    		@NotBlank(message = "Symbol cannot be empty")
		    @Pattern(regexp = "^[A-Z]{1,5}$", message = "Symbol must be 1-5 uppercase letters")
    		String symbol) {
        return service.getTransactionHistory(port_id, symbol);
    }
}
