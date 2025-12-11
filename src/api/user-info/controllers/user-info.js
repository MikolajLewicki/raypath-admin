// Używamy wbudowanego Buffer, tak jak w Auth.js
const { Buffer } = require('buffer'); 

module.exports = {
  async getUserInfo(ctx) {
    const { id_token } = ctx.request.query;
    console.log("-------------", ctx.request.query);


    if (!id_token) {
      // Dalsze sprawdzanie nagłówka dla pełnej zgodności z OIDC, choć najpewniej token jest w URL
      const authHeader = ctx.request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
         // Tutaj mogłaby być logika, jeśli plugin SSO wysyła id_token jako Access Token
      }
      return ctx.badRequest('ID Token is missing from query parameters.');
    }

    try {
      // 1. Ręczne dekodowanie ID Tokena (tak jak w Auth.js)
      if (!id_token.split('.')[1]) {
           return ctx.badRequest('Invalid ID Token format (missing body).');
      }

      const decodedBody = Buffer.from(id_token.split('.')[1], "base64").toString();
      const decoded = JSON.parse(decodedBody);

      if (!decoded) {
        return ctx.badRequest('Invalid ID Token format.');
      }

      // 2. Mapowanie pól użytkownika
      // Używamy pól znalezionych w Pana konfiguracji Auth.js:
      const userInfo = {
        sub: decoded.sub,
        email: decoded.email.email, // Na podstawie Pana konfiguracji: decoded.email?.email
        given_name: decoded.profile?.name, // Używamy 'name' z profilu jako 'given_name'
        family_name: 'IdOSell User', // Ustawiamy stałą wartość lub wstawiamy 'undefined'
      };
      
      // Zgodnie z tym, co widzę w Pana konfiguracji:
      // - Strapi wymaga `given_name` i `family_name`
      // - Pana dekodowanie z Auth.js używa `name: decoded.profile?.name`
      // Musimy zdecydować, które pola ma zwrócić nasz endpoint, aby plugin SSO je przyjął.
      
      return {
        email: userInfo.email,
        // Strapi SSO domyślnie oczekuje 'given_name' i 'family_name'
        given_name: userInfo.given_name || 'IdoSell', 
        family_name: userInfo.family_name || userInfo.sub, // Użyjemy sub jako zastępstwo dla Family Name
        // Dodatkowe pole, które Strapi może wymagać do identyfikacji
        sub: userInfo.sub
      };
      
    } catch (error) {
      console.error('Error processing ID Token:', error);
      return ctx.badRequest(`Error processing ID Token: ${error.message}`);
    }
  },
};