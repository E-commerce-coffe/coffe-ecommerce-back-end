describe('Prueba de API con Cypress', () => {
    it('Debería retornar un mensaje de error si ya existe un usuario con el mismo correo electrónico', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/users/create', // Cambia la URL a tu endpoint
        body: {
            "nombre_usuario": "daniel",
            "apellido_usuario": "barreto",
            "documento_usuario": 119355,
            "correo_usuario": "adbs@example.com",
            "tipo_documento": "CC",
            "tipo_usuario": "C",
            "credenciales": {
              "contrasena_usuario": "dan1234"
            }
        }
      }).then((response) => {
        expect(response.status).to.equal(400); // Verificar el código de estado
  
        // Verificar el mensaje de error (ajusta esto según la respuesta esperada)
        expect(response.body).to.eq({ error: 'Ya existe un usuario con este correo electrónico' });
      });
    });
  });
  