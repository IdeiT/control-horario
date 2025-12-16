package com.proyecto.controlhorario.security;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class RecaptchaVerifier {

    // ⚠️ IMPORTANTE:  Reemplaza con tu SECRET KEY de Google reCAPTCHA
    private static final String SECRET_KEY = "6Ld0hy0sAAAAAJOtf9QKo9Bvi_LZWoyw5UwjlbiA";
    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    /**
     * Verifica el token de reCAPTCHA con Google
     * @param recaptchaToken Token recibido del frontend
     * @return true si el CAPTCHA es válido, false si no
     */
    public static boolean verify(String recaptchaToken) {
        if (recaptchaToken == null || recaptchaToken.isEmpty()) {
            System.out.println("❌ Token de reCAPTCHA vacío");
            return false;
        }

        try {
            // Construir parámetros
            String params = "secret=" + SECRET_KEY + "&response=" + recaptchaToken;
            byte[] postData = params.getBytes(StandardCharsets.UTF_8);

            // Crear conexión
            URL url = new URL(VERIFY_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("Content-Length", String.valueOf(postData.length));

            // Enviar solicitud
            try (OutputStream os = conn.getOutputStream()) {
                os.write(postData);
            }

            // Leer respuesta
            int responseCode = conn.getResponseCode();
            System.out.println("📡 Respuesta de Google reCAPTCHA:  " + responseCode);

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            // Parsear JSON de respuesta
            String jsonResponse = response.toString();
            System.out.println("📦 JSON de Google:  " + jsonResponse);

            JsonObject jsonObject = JsonParser.parseString(jsonResponse).getAsJsonObject();
            boolean success = jsonObject.get("success").getAsBoolean();

            if (success) {
                System.out.println("✅ reCAPTCHA verificado correctamente");
            } else {
                System.out.println("❌ reCAPTCHA inválido");
                if (jsonObject.has("error-codes")) {
                    System. out.println("Errores:  " + jsonObject.get("error-codes"));
                }
            }

            return success;

        } catch (Exception e) {
            System.err.println("💥 Error al verificar reCAPTCHA: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
