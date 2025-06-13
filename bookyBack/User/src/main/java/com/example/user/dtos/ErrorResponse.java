package com.example.user.dtos;

public class ErrorResponse {
    private String error;
    private String details;
    private Object data;

    // Constructors
    public ErrorResponse(String error) {
        this.error = error;
    }

    public ErrorResponse(String error, String details) {
        this.error = error;
        this.details = details;
    }

    public ErrorResponse(String error, String details, Object data) {
        this.error = error;
        this.details = details;
        this.data = data;
    }

    // Getters and Setters
    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}