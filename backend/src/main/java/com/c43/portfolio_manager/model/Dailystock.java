package com.c43.portfolio_manager.model;

import java.sql.Date;
import org.springframework.format.annotation.DateTimeFormat;
import jakarta.validation.constraints.*;

public class Dailystock {
	
	@PastOrPresent(message = "Timestamp cannot be in the future")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
	public Date timestamp;
	
	@Min(value = 0, message = "Open price must be positive")
	public double open;
	
	@Min(value = 0, message = "High price must be positive")
	public double high;
	
	@Min(value = 0, message = "Low price must be positive")
	public double low;
	
	@Min(value = 0, message = "Close price must be positive")
	public double close;
	
	@Min(value = 0, message = "Volume must be positive")
	public int volume;
	
	@NotBlank(message = "Symbol cannot be empty")
	@Pattern(regexp = "^[a-zA-Z]+$", message = "Symbol can only contain letters")
	public String symbol;
	
	public Dailystock(Date timestamp, double open, double high, double low, double close, int volume, String symbol) {
		this.timestamp = timestamp;
		this.open = open;
		this.high = high;
		this.low = low;
		this.close = close;
		this.volume = volume;
		this.symbol = symbol;
	}
}
