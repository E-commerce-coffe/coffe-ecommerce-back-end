describe('Prueba de restablecimiento de contraseña con Cypress', () => {
    it('Debería generar un token de restablecimiento de contraseña y responder con un mensaje de éxito', () => {
      // Datos del usuario
      const user = {
        username: 'daniel.com', // reemplaza esto con un correo de usuario existente en tu base de datos
      };
  
      // Enviar la solicitud PUT
      cy.request('PUT', 'http://localhost:3000/users/forgot-password', user)
        .then((response) => {
          // Verificar el código de estado
          expect(response.status).to.equal(200);
  
          // Verificar la respuesta JSON que contiene el mensaje de éxito
          expect(response.body).to.have.property('message', 'Revisa tu correo electrónico para restablecer tu contraseña');
        });
    });
  });