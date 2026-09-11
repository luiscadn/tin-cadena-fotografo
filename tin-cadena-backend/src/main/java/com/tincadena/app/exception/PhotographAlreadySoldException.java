package com.tincadena.app.exception;

public class PhotographAlreadySoldException extends RuntimeException {
    public PhotographAlreadySoldException(String message) {
        super(message);
    }
}
