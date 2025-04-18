describe ('Login App', () =>{

// const urlB = 'http://localhost:3000'
// const urlF = 'http://localhost:5173'
const urlB = 'https://loginapp-tjlf.onrender.com/api'
const urlF = 'https://loginapp-tjlf.onrender.com'

// για τα τεστ μου θα δημιουργήσω δύο χρηστες έναν αντμιν και έναν οχι. Στην αρχή θα πάρω τα τοκεν και τα id, για να τα χρησιμοποιήσω για να τους σβήσω στο τέλος του τεστ
const user = {
  name: 'testerAdmin',
  username: 'testerAdmin',
  password: '123',
  email: 'admin@google.com',  // προσοχη το μεηλ ηταν υποχρεωτικο
  roles: ['admin']
}

const user2 = {
  name: 'tester',
  username: 'tester',
  password: '123',
  email: 'user2@google.com',
  roles: ['user']
}

let userIdAdmin = null
let tokenAdmin = null

let userId2 = null
let token2 = null

  before(() => {
    // για την δημιουργία του admin
    cy.request('POST', `${urlB}/api/users`, user)
      .then((res) => {
        userIdAdmin = res.body._id
        expect(userIdAdmin).to.exist
        console.log('userId:', userIdAdmin);
      })
    cy.request('POST', `${urlB}/api/login`, {
      username:user.username,
      password:user.password
    })
      .then((res) => {
        tokenAdmin = res.body.data.token
        expect(tokenAdmin).to.exist
        console.log('token:', tokenAdmin)        
      })
    
    cy.wait(500)

    // για την δημιουργία του user2
    cy.request('POST', `${urlB}/api/users`, user2)
      .then((res) => {
        userId2 = res.body._id
        expect(userId2).to.exist
        console.log('user2Id:', userId2);
      })
    cy.request('POST', `${urlB}/api/login`, {
      username:user2.username,
      password:user2.password
    })
      .then((res) => {
        token2 = res.body.data.token
        expect(token2).to.exist
        console.log('token2:', token2)        
      })
  })

  after(() => {
    console.log('TokenAdmin for delete request:', tokenAdmin)
    cy.request({
      method: 'DELETE',
      url: `${urlB}/api/users/${userIdAdmin}`,
      headers: {
        Authorization: `Bearer ${tokenAdmin}`
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
    })

    cy.wait(500)

    cy.request({
      method: 'DELETE',
      url: `${urlB}/api/users/${userId2}`,
      headers: {
        Authorization: `Bearer ${tokenAdmin}`
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('page can be accesed', function() {
    cy.visit(urlF)
    cy.contains('Login APP')
    cy.contains('login')
    cy.contains('username').should('exist')
    cy.contains('password').should('exist')
    cy.get('form').should('exist')
  })

  it('succeeds with correct credentials', function () {
    cy.visit(urlF) 
    cy.get('#username').type('tester')
    cy.get('#password').type('123')
    cy.get('#loginBtn').click()
    cy.contains('Welcome user')
    cy.get('#adminBtn').should('not.exist')
    cy.get('#logoutBtn').click()
  })

  it('succeeds with admin credentials and can do admin oparations', function () {
    cy.visit(urlF) 
    cy.get('#username').type('testerAdmin')
    cy.get('#password').type('123')
    cy.get('#loginBtn').click()
    cy.contains('Welcome user')
    cy.get('#adminBtn').should('exist')
    cy.get('#adminBtn').click()
    cy.get('#createUserBtn').click()
    cy.get('#createUsername').type('DeleteMe')
    cy.get('#createName').type('DeleteMe')
    cy.get('#createEmail').type('DeleteMe@junkmail.com')
    cy.get('#createPassword').type('123')
    cy.wait(500)
    cy.get('#submitCreateBtn').click()
    cy.wait(5000)
    cy.get('#adminBtn').click()
    cy.wait(5000)
    cy.get('#DeleteMeBtn').should('exist')
    cy.get('#DeleteMeBtn').click()
    cy.wait(5000)
    cy.get('#adminBtn').click()
    cy.wait(5000)
    cy.contains('DeleteMe').should('not.exist')
    // cy.wait(5000)
    // cy.get('#logoutBtn').click()
  })
})