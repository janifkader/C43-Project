package com.c43.portfolio_manager.model;
public class Review {
	public int review_id;
	public int user_id;
	public int sl_id;
	public String text;
	
	public Review(int review_id, int user_id, int sl_id, String text) {
		this.review_id = review_id;
		this.user_id = user_id;
		this.sl_id = sl_id;
		this.text = text;
	}
}
