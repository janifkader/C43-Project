package com.c43.portfolio_manager.endpoints;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class Validator {

    // 1. Handle DTO Validation Errors (@RequestBody)
    // Triggers when @Valid fails on an object
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        // Returns 400 Bad Request with JSON: { "username": "must not be empty" }
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // 2. Handle Parameter/Variable Validation Errors (@RequestParam, @PathVariable)
    // Triggers when @Validated (class level) checks fail on specific args
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getConstraintViolations().forEach(violation -> {
            String path = violation.getPropertyPath().toString();
            // path is usually "methodName.variableName", we just want "variableName"
            String field = path.substring(path.lastIndexOf('.') + 1);
            String message = violation.getMessage();
            errors.put(field, message);
        });

        // Returns 400 Bad Request with JSON: { "id": "must be positive" }
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // 3. Generic Fallback (Optional but Recommended)
    // Catches any other crash so the user doesn't see a giant Java stack trace
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralError(Exception ex) {
        // Log the error internally here (System.out.println or Logger)
        return new ResponseEntity<>("An unexpected error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}