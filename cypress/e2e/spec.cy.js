describe('get singel user',()=>{

  it('validate status 200',()=>{
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/users',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200)
    })

  });
})