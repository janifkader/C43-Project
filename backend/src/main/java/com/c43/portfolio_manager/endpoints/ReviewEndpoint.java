package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.Review;
import com.c43.portfolio_manager.service.ReviewService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@RestController
@RequestMapping("/reviews")
public class ReviewEndpoint {
	
    private final ReviewService service;
    
    public ReviewEndpoint(ReviewService service) {
        this.service = service;
    }
    
    @PostMapping("/")
    public int createReview(@CookieValue(value = "user_id", defaultValue = "-1") int user_id, @Valid @RequestBody Review review) {
        return service.createReview(user_id, review.sl_id, review.text);
    }
    
    @GetMapping("/")
    public List<Review> getReviews(@RequestParam @Min(value = 1, message = "Stock List ID must be positive") int sl_id) {
        return service.getReviews(sl_id);
    }
    
    @DeleteMapping("/")
    public boolean deleteReview(@RequestParam @Min(value = 1, message = "Review ID must be positive") int review_id, @CookieValue(value = "user_id", defaultValue = "-1") int user_id) {
        return service.deleteReview(review_id, user_id);
    }
    
    @PutMapping("/")
    public boolean editReview(
    		@RequestParam 
    		@Min(value = 1, message = "Review ID must be positive")
    		int review_id, 
    		@CookieValue(value = "user_id", defaultValue = "-1") int user_id, 
    		@RequestParam 
    		@NotBlank(message = "Text cannot be empty")
    		@Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Text can only contain letters and numbers")
    		String text) {
        return service.editReview(review_id, user_id, text);
    }
}
