describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'tester',
      username: 'tester',
      password: '123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:5173')
  })

  // beforeEach(function() {
  //   cy.request('POST', 'http://localhost:3003/api/login', {
  //     username: 'tester', password: '123'
  //   }).then(response => {
  //     localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
  //     cy.visit('http://localhost:5173')
  //   })
  // })


  it('front page can be opened', function() {
    cy.contains('username')
  })

  it('Login form is shown', function() {
    cy.contains('login').click()
  })

  it('Login form is shown', function() {
    cy.contains('username').should('exist')
    cy.contains('password').should('exist')
    cy.get('form').should('exist')
  })

  it('succeeds with correct credentials', function () {
    cy.contains('login').click()
    cy.get('#username').type('tester')
    cy.get('#password').type('123')
    cy.get('[data-testid="login-button"]').click()
    cy.contains('tester logged in')
  })

  describe ('fails with wrong credentials', function () {
    it('login fails with wrong credentials', function(){
      cy.contains('login').click()
      cy.get('#username').type('testerwrong')
      cy.get('#password').type('wrong')
      cy.get('[data-testid="login-button"]').click()

      cy.get('#notification').contains('Wrong')
      cy.get('#notification').should('have.css', 'backgroundColor', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'testerwrong logged in')
    })
  })
  
  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('tester')
      cy.get('#password').type('123')
      cy.get('[data-testid="login-button"]').click()
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.contains('new blog').click()
        cy.get('#title').type('a blog created by cypress')
        cy.get('#author').type('cypress tester')
        cy.get('#url').type('http://localhost:5173')
        cy.get('#create').click()
      })

      it('it can be made not important', function () {
        cy.contains('a blog created by cypress')
        cy.get('#view').click()

        cy.contains('a blog created by cypress')
        cy.get('#hide').click()
      })

      it('only the creator can delete the blog', function() {
        cy.wait(3000)
        cy.contains('new blog').click()
        cy.get('#title').type('delet tester')
        cy.get('#author').type('cypress tester')
        cy.get('#url').type('http://localhost:5173')
        cy.get('#create').click()
        cy.get('#view').click()
        cy.get('#delete').click()
        cy.contains('delete tester').should('not.exist')
        cy.get('#logout').click()

        const user2 = {
          name: 'tester2',
          username: 'tester2',
          password: '123'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user2)
        cy.contains('login').click()
        cy.get('#username').type('tester2')
        cy.get('#password').type('123')
        cy.get('[data-testid="login-button"]').click()
        cy.get('#view').click()

        cy.contains('delete').should('not.exist')
      })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress tester')
      cy.get('#url').type('http://localhost:5173')
      cy.get('#create').click()
      cy.contains('a blog created by cypress')
      // cy.get('#logout').click()
    })

    it('confirms users can like a blog', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('first blog tester')
      cy.get('#author').type('cypress tester')
      cy.get('#url').type('http://localhost:5173')
      cy.get('#create').click()
      cy.get('#view').click()
      cy.get('#testLikes').click()
      cy.wait(500)
      cy.contains('likes: 1')
      cy.get('#hide').click()
    })
  })

  describe('order of liked blogs', function () {
    it('creates 2 blogs', function () {

      cy.login({ username: 'tester', password: '123' })

      cy.wait(1000)
      cy.window().then((win) => {
        const user = win.localStorage.getItem('loggedUser')
        expect(user).to.not.be.null // Ensure user exists
        const parsedUser = JSON.parse(user || '{}') // Prevent parsing errors if null
        expect(parsedUser.token).to.exist // Ensure token exists

      cy.log(`Token: ${parsedUser.token}`) 
      cy.createBlog({
        title: "two likes",
        author:"tester",
        url:"https://test.com",
        likes: 2,
      }, parsedUser.token)
      cy.createBlog({
        title: "three likes",
        author:"tester",
        url:"https://test.com",
        likes: 3,
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }, parsedUser.token)

      cy.get('#view').click()
      cy.get('#testLikes').click()
      cy.wait(500)
      cy.get('#testLikes').click()
      cy.wait(500)
      cy.contains('likes: 2')
      cy.get('#view').click()
      cy.get('#hide').click()
      cy.get('#testLikes').click()
      cy.wait(500)
      cy.get('#testLikes').click()
      cy.wait(500)
      cy.get('#testLikes').click()
      cy.wait(500)
      cy.contains('likes: 3')
      cy.get('#view').click()

      cy.get('.blog').eq(0).should('contain', 'three likes')
      cy.get('.blog').eq(1).should('contain', 'two likes')
    

        // .then(() => {
        //   const twoLikes = {
        //     title:"two likes",
        //     author:"tester",
        //     url:"https://test.com",
        //     likes: 2,
        //     headers: {
        //       'Authorization': `Bearer ${token}`
        //     }
        //   }
        //   const oneLikes = {
        //     title:"one likes",
        //     author:"tester",
        //     url:"https://test.com",
        //     likes: 1,
        //     headers: {
        //       'Authorization': `Bearer ${token}`
        //     }
        //   }

        //   cy.request('POST', 'http://localhost:3003/api/blogs/', twoLikes)
        //   cy.request('POST', 'http://localhost:3003/api/blogs/', oneLikes)
        // })
      })
    })
  })
})