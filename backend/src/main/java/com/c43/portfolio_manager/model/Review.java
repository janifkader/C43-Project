package com.c43.portfolio_manager.model;
public class Review {
	private int review_id;
	private int user_id;
	private int sl_id;
	private String text;
	
	public Review(int review_id, int user_id, int sl_id, String text) {
		this.review_id = review_id;
		this.user_id = user_id;
		this.sl_id = sl_id;
		this.text = text;
	}
}
