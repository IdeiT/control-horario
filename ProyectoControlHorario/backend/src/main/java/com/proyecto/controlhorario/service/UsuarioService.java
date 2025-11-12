package com.proyecto.controlhorario.service;

import com.proyecto.controlhorario.dao.UsuarioDAO;
import com.proyecto.controlhorario.dto.LoginDto;
import com.proyecto.controlhorario.dto.RegistroDto;
import com.proyecto.controlhorario.security.JwtUtil;

import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioDAO usuarioDAO;

    public  UsuarioService(UsuarioDAO registroDAO) {
        this.usuarioDAO = registroDAO;
    }

    public void guardarRegistro(RegistroDto dto) {
        System.out.println(usuarioDAO.registrarUsuario(dto));
    }
    
    public LoginDto solicitarLogin(LoginDto dto) {

        // ✅ Generar el token JWT
        LoginDto loginResult = usuarioDAO.loginUsuario(dto);
        String token = JwtUtil.generateToken(loginResult.getUsername(), loginResult.getDepartamento(), loginResult.getRol());
        loginResult.setToken(token);
        
        return loginResult;
    }

}
    