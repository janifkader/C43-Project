package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.Review;
import com.c43.portfolio_manager.service.ReviewService;

@RestController
@RequestMapping("/reviews")
public class ReviewEndpoint {
	private final ReviewService service;
	
	public ReviewEndpoint(ReviewService service) {
		this.service = service;
	}
	
	@PostMapping("/")
	public int create(@RequestParam int user_id, @RequestParam int sl_id, @RequestParam String text) {
		return service.createReview(user_id, sl_id, text);
	}
	
	@GetMapping("/")
	public List<Review> get(@RequestParam int sl_id){
		return service.getReviews(sl_id);
	}
}
