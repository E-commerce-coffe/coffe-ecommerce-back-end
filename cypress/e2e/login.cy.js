describe('Prueba de inicio de sesión con Cypress', () => {
    it('Debería recibir datos encriptados y responder con un token', () => {
      // Supongamos que tienes una función en tu servidor que desencripta los datos
      // y responde con un token y un mensaje
      cy.request('POST', 'http://localhost:3000/users/login', {
        usuario: 'U2FsdGVkX19xIowl2gTChT+xS9ymWXp1jEYeVxl4C2M=',
        contrasena: 'dan1234',
      }).then((response) => {
        // Verificar el código de estado
        expect(response.status).to.equal(200);
  
        // Verificar la respuesta JSON que contiene el token y el mensaje
        expect(response.body).to.have.property('token').and.to.be.a('string');
        expect(response.body).to.have.property('message', 'Inicio de sesión correcto');
      });
    });
  });
  
  