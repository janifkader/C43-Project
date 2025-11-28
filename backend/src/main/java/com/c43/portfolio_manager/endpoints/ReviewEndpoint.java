package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.Review;
import com.c43.portfolio_manager.model.ReviewText;
import com.c43.portfolio_manager.service.ReviewService;

@RestController
@RequestMapping("/reviews")
public class ReviewEndpoint {
	private final ReviewService service;
	
	public ReviewEndpoint(ReviewService service) {
		this.service = service;
	}
	
	@PostMapping("/")
	public int create(@RequestBody Review review) {
		return service.createReview(review.user_id, review.sl_id, review.text);
	}
	
	@GetMapping("/")
	public List<ReviewText> get(@RequestParam int sl_id){
		return service.getReviews(sl_id);
	}
}
