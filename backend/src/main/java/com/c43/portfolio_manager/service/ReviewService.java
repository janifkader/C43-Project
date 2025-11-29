package com.c43.portfolio_manager.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.model.Review;
import com.c43.portfolio_manager.repository.ReviewRepo;


@Service
public class ReviewService {
    
    private ReviewRepo repo = new ReviewRepo();
    
    public int createReview(int user_id, int sl_id, String text) {
        return repo.createReview(user_id, sl_id, text);
    }
    
    public List<Review> getReviews(int sl_id) {
		return repo.getReviews(sl_id);
	}
    
    public boolean deleteReview(int review_id, int user_id) {
        return repo.deleteReview(review_id, user_id);
    }
    
    public boolean editReview(int review_id, int user_id, String new_text) {
        return repo.editReview(review_id, user_id, new_text);
    }
}
