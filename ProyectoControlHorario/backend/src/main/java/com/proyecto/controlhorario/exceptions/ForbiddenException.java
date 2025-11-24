package com.proyecto.controlhorario.exceptions;

/**
 * Excepción lanzada cuando un usuario no tiene permisos para realizar una acción.
 */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
