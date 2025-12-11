module.exports = {
  routes: [
    {
      // Metoda HTTP, której użyje plugin SSO do pobrania danych
      method: 'GET',
      
      // Ścieżka URL, którą plugin SSO będzie wywoływał.
      // Pełny adres to /api/user-info/oidc-data
      path: '/user-info/oidc-data',
      
      // Wskazuje, która metoda w kontrolerze ma obsłużyć to żądanie
      handler: 'user-info.getUserInfo',
      
      config: {
        // Ustawienie na 'false' jest krytyczne,
        // ponieważ autoryzacja jest przeprowadzana przez sam plugin SSO,
        // który wywołuje ten endpoint z tokenem w zapytaniu (query string).
        auth: false, 
      },
    },
  ],
};