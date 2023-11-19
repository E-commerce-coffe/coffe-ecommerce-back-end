describe('Prueba de obtener un producto con Cypress', () => {
    it('Debería obtener un producto y responder con los datos del producto', () => {
      // ID del producto a obtener
      const productId = 9; // reemplaza esto con un ID de producto válido
  
      // Enviar la solicitud GET
      cy.request('GET', `http://localhost:3000/products/id?id=${productId}`)
        .then((response) => {
          // Verificar el código de estado
          expect(response.status).to.equal(200);
  
          // Verificar la respuesta JSON que contiene los datos del producto
          expect(response.body).to.have.property('id', productId);
          // puedes agregar más expectativas aquí para verificar otros campos del producto
        });
    });
  });