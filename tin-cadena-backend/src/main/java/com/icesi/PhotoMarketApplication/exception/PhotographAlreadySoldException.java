package com.icesi.PhotoMarketApplication.exception;

public class PhotographAlreadySoldException extends RuntimeException {
    public PhotographAlreadySoldException(String message) {
        super(message);
    }
}
