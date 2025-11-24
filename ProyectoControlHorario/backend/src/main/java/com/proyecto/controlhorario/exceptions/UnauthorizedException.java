package com.proyecto.controlhorario.exceptions;

/**
 * Excepción lanzada cuando un usuario no tiene permisos para realizar una acción.
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
