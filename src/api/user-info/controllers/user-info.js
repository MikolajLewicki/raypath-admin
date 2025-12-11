const { Buffer } = require('buffer'); 

module.exports = {
  async getUserInfo(ctx) {
    // 1. Sprawdzenie nagłówka Authorization (jak w logach)
    const authHeader = ctx.request.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Wyodrębnienie tokena z formatu "Bearer [token]"
      token = authHeader.substring(7);
    }

    if (!token) {
      // Odrzucenie żądania, jeśli nagłówek jest pusty/nieprawidłowy
      return ctx.badRequest('Authorization header with Bearer token is missing.');
    }

    try {
      // 2. Ręczne dekodowanie tokena (zakładamy, że to jest ID Token/JWT)
      const parts = token.split('.');
      
      if (parts.length !== 3) {
           return ctx.badRequest('Invalid token format: Token is not a standard JWT (Expected 3 parts).');
      }

      // Dekodowanie środkowej części (payload)
      const decodedBody = Buffer.from(parts[1], "base64").toString();
      const decoded = JSON.parse(decodedBody);

      if (!decoded) {
        return ctx.badRequest('Error decoding token payload.');
      }

      // 3. Mapowanie pól użytkownika
      // Używamy struktury danych z Pana konfiguracji NextAuth:
      const userInfo = {
        // sub jest wymagane jako unikalne ID
        sub: decoded.sub, 
        
        // Zgodnie z Pana konfiguracją: decoded.email?.email
        email: decoded.email && decoded.email.email ? decoded.email.email : null, 
        
        // Zgodnie z Pana konfiguracją: decoded.profile?.name
        // Mapujemy na pola wymagane przez plugin SSO: given_name i family_name
        given_name: decoded.profile && decoded.profile.name ? decoded.profile.name : 'IdoSell', 
        family_name: decoded.sub || 'User', // Używamy sub jako backup
      };
      
      if (!userInfo.email) {
          return ctx.badRequest('Email field (decoded.email.email) not found in token payload.');
      }
      
      // 4. Zwrócenie danych
      // To jest format, którego oczekuje plugin SSO, aby utworzyć lub zaktualizować użytkownika.
      return {
        email: userInfo.email,
        given_name: userInfo.given_name, 
        family_name: userInfo.family_name,
        // (Ważne: upewnij się, że nazwy pól są takie same, jak w konfiguracji Strapi SSO)
        // OIDC_GIVEN_NAME_FIELD => given_name
        // OIDC_FAMILY_NAME_FIELD => family_name
      };
      
    } catch (error) {
      console.error('Error processing ID Token in custom controller:', error.message);
      return ctx.badRequest(`Internal Controller Error: ${error.message}`);
    }
  },
};