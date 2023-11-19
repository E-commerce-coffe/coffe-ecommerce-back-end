describe('Prueba de creación de usuario con Cypress', () => {
    it('Debería crear un nuevo usuario y responder con un mensaje de éxito', () => {
      // Datos del nuevo usuario
      const newUser = {
        nombre_usuario: 'Anderson',
        apellido_usuario: 'Perez',
        documento_usuario: 119355500,
        correo_usuario: 'anderson@example.com',
        tipo_documento: 'CC',
        contrasena_usuario: 'dan1234',
        tipo_usuario: 'A'
      };
  
      // Enviar la solicitud POST
      cy.request('POST', 'http://localhost:3000/users/create', newUser)
        .then((response) => {
          // Verificar el código de estado
          expect(response.status).to.equal(201);
  
          // Verificar la respuesta JSON que contiene el mensaje de éxito
          expect(response.body).to.have.property('message', 'Usuario creado correctamente');
        });
    });
  });