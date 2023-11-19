describe('Prueba de restablecimiento de contraseña con Cypress', () => {
    it('Debería cambiar la contraseña del usuario y responder con un mensaje de éxito', () => {
      // Datos de la solicitud
      const requestData = {
        newpassword: 'dan1234', // reemplaza esto con la nueva contraseña
      };
      const resetToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDA0MjU0OTUsImV4cCI6MTcwMDQyNjA5NX0.Od6kEQuex-lLKsRpyon0JINKWqIntlY4PTI2zAGWNBc'; // reemplaza esto con un token de reseteo válido
  
      // Enviar la solicitud PUT
      cy.request({
        method: 'PUT',
        url: 'http://localhost:3000/users/reset-password',
        headers: {
          reset: resetToken,
        },
        body: requestData,
      })
        .then((response) => {
          // Verificar el código de estado
          expect(response.status).to.equal(200);
  
          // Verificar la respuesta JSON que contiene el mensaje de éxito
          expect(response.body).to.have.property('message', 'contraseña cambiada correctamente');
        });
    });
  });