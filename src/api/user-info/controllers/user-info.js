module.exports = {
  async getUserInfo(ctx) {
    // 1. Sprawdzenie nagłówka Authorization
    // Robimy to tylko po to, aby potwierdzić, że żądanie pochodzi od pluginu SSO (po udanej autoryzacji tokenem).
    const authHeader = ctx.request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Jeśli brakuje nagłówka lub jest w złym formacie, odrzucamy żądanie.
      return ctx.badRequest('Authorization header with Bearer token is missing or malformed.');
    }

    // 2. Hardkodowanie danych wspólnego użytkownika Strapi
    // UŻYWAJ TEGO DLA WSZYSTKICH:
    const HARDCODED_USER_INFO = {
      // WAŻNE: Ten email musi być unikalny dla Strapi
      email: "admin@raypath.eco", 
      
      // Te pola są wymagane przez plugin SSO do utworzenia/znalezienia użytkownika
      given_name: "raypath", 
      family_name: "eco",
    };

    try {
      // 3. Zwrócenie hardkodowanych danych
      // Plugin SSO otrzyma te dane, sprawdzi czy użytkownik o tym emailu istnieje,
      // a jeśli nie, utworzy go. Następnie zaloguje tego użytkownika.
      return {
        email: HARDCODED_USER_INFO.email,
        given_name: HARDCODED_USER_INFO.given_name,
        family_name: HARDCODED_USER_INFO.family_name,
      };
      
    } catch (error) {
      // Ta sekcja powinna być teraz rzadko osiągana, bo nie ma skomplikowanej logiki
      console.error('Error in custom User Info Controller:', error.message);
      return ctx.internalServerError('An error occurred while processing user data.');
    }
  },
};