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
    
    @PostMapping("/create")
    public int createReview(@RequestParam int user_id, @RequestParam int sl_id, @RequestParam String text) {
        return service.createReview(user_id, sl_id, text);
    }
    
    @GetMapping("/get")
    public List<Review> getReviews(@RequestParam int sl_id) {
        return service.getReviews(sl_id);
    }
    
    @DeleteMapping("/delete")
    public boolean deleteReview(@RequestParam int review_id, @RequestParam int user_id) {
        return service.deleteReview(review_id, user_id);
    }
    
    @PutMapping("/edit")
    public boolean editReview(@RequestParam int review_id, @RequestParam int user_id, @RequestParam String new_text) {
        return service.editReview(review_id, user_id, new_text);
    }
}
