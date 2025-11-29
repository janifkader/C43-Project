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
    public int createReview(@RequestBody Review review) {
        return service.createReview(review.user_id, review.sl_id, review.text);
    }
    
    @GetMapping("/")
    public List<Review> getReviews(@RequestParam int sl_id) {
        return service.getReviews(sl_id);
    }
    
    @DeleteMapping("/")
    public boolean deleteReview(@RequestParam int review_id, @RequestParam int user_id) {
        return service.deleteReview(review_id, user_id);
    }
    
    @PutMapping("/")
    public boolean editReview(@RequestParam int review_id, @RequestParam int user_id, @RequestParam String text) {
        return service.editReview(review_id, user_id, text);
    }
}
