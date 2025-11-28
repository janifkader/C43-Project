package com.c43.portfolio_manager.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.model.ReviewText;
import com.c43.portfolio_manager.repository.ReviewRepo;

@Service
public class ReviewService {
	
	private ReviewRepo repo = new ReviewRepo();
	
	public int createReview(int user_id, int sl_id, String text) {
		return repo.createReview(user_id, sl_id, text);
	}
	
	public List<ReviewText> getReviews(int sl_id) {
		return repo.getReviews(sl_id);
	}
}
