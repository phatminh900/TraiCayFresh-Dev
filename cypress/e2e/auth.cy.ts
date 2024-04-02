
describe("signUP", () => {
  beforeEach(() => {
    cy.visit("/sign-up");
  });
  it("focuses on the first input (name)", () => {
    cy.get('[data-cy="input-name-sign-up"]').should("have.focus");
  });
  it("shows errors for fields that are empty when submitting the form", () => {
    cy.get('[data-cy="form-sign-up"] button[type="submit"]').click();

    // name
    cy.get('[data-cy="input-name-sign-up"]').as("input-name");
    cy.get("@input-name").should((input) => {
      expect(input[0].className).to.contains("ring-red");
    });
    cy.get('@input-name').next('[data-cy="form-error-msg"]').should('have.text',"Tên phải từ 2 chữ cái")
    // email
    cy.get('[data-cy="input-email-sign-up"]').as("input-email");
    cy.get("@input-email").should((input) => {
      expect(input[0].className).to.contains("ring-red");
    });
    cy.get('@input-email').next('[data-cy="form-error-msg"]').should('have.text',"Định dạng email không đúng")

    // // password
    cy.get('[data-cy="input-password-sign-up"]').as("input-password");
    cy.get("@input-password").should((input) => {
      expect(input[0].className).to.contains("ring-red");
    });
    cy.get('@input-password').parent().next('[data-cy="form-error-msg"]').should('have.text',"Mật khẩu phải có ít nhất 6 kí tự")


    // // password-confirm
    cy.get('[data-cy="input-password-confirm-sign-up"]').as(
      "input-password-confirm"
    );
    cy.get("@input-password-confirm").should((input) => {
      expect(input[0].className).to.contains("ring-red");
    });
    // pass word and password confirm siblings are another buttons
    cy.get('@input-password-confirm').parent().next('[data-cy="form-error-msg"]').should('have.text',"Nhập lại mật khẩu phải có ít nhất 6 kí tự")

  });
  it('change the input type from password to text ',()=>{
    cy.get('[data-cy="input-password-sign-up"]').as("input-password");
    cy.get('@input-password').should((el)=>{
      expect(el.attr('type')).to.be.eq('password')
    })
    cy.get('@input-password').next('button[type="button"]').click()
    cy.get('@input-password').should((el)=>{
      expect(el.attr('type')).to.be.eq('text')
    })
  })
  it('navigate to the login page if clicking already have account',()=>{
   cy.get("[data-cy='link-to-login-instead']").click()
   cy.location('pathname').should('eq','/login')
  })
});


describe('login',()=>{
  beforeEach(()=>{
    cy.visit('/login')
  })
  it("focuses on the first input (email)", () => {
    cy.get('[data-cy="input-email-login"]').should("have.focus");
  });
  it("shows errors for fields that are empty when submitting the form", () => {
    cy.get('form').contains("Đăng nhập").click();

    // email
    cy.get('[data-cy="input-email-login"]').as("input-email");
    cy.get("@input-email").should((input) => {
      expect(input[0].className).to.contains("ring-red");
    });
    cy.get('@input-email').next('[data-cy="form-error-msg"]').should('have.text',"Định dạng email không đúng")

    // // password
    cy.get('[data-cy="input-password-login"]').as("input-password");
    cy.get("@input-password").should((input) => {
      expect(input[0].className).to.contains("ring-red");
    });
    cy.get('@input-password').parent().next('[data-cy="form-error-msg"]').should('have.text',"Mật khẩu phải có ít nhất 6 kí tự")

  });
  it('navigates to the forgot-password when clicking forget-password btn',()=>{
    cy.get("[data-cy='forgot-password-link']").click()
    cy.location('pathname').should('eq','/forgot-password')
  })
  it('navigates to the login page when clicking not have an account yet',()=>{
    cy.get("a").contains('Chưa có tài khoản. Đăng kí ngay →').click()

    cy.location('pathname').should('eq','/sign-up')
  })
})
describe('forgot-password',()=>{
  beforeEach(()=>{
    cy.visit('/forgot-password')
  })
  it("focuses on the first input (email)", () => {
    cy.get('[data-cy="input-email-forgot-password"]').should("have.focus");
  });
  it('shows only 1 path in the breadcrumbs link if i enter the path directly',()=>{
    // the home page and the actual path url
    cy.get('[data-cy="breadcrumb-list-item"]').should('have.length',2)
  })
  it('shows only 2 path in the breadcrumbs link if i navigate from login',()=>{
    cy.visit('/login')
   cy.get("[data-cy='forgot-password-link']").click()

    // the home page and  the login page the actual path url
    cy.get('[data-cy="breadcrumb-list-item"]').should('have.length',3)
  })
  // it.skip("shows errors for fields that are empty when submitting the form", () => {
  //   cy.get('form').contains("Đăng nhập").click();

  //   // email
  //   cy.get('[data-cy="input-email-login"]').as("input-email");
  //   cy.get("@input-email").should((input) => {
  //     expect(input[0].className).to.contains("ring-red");
  //   });
  //   cy.get('@input-email').next('[data-cy="form-error-msg"]').should('have.text',"Định dạng email không đúng")

  //   // // password
  //   cy.get('[data-cy="input-password-login"]').as("input-password");
  //   cy.get("@input-password").should((input) => {
  //     expect(input[0].className).to.contains("ring-red");
  //   });
  //   cy.get('@input-password').parent().next('[data-cy="form-error-msg"]').should('have.text',"Mật khẩu phải có ít nhất 6 kí tự")

  // });
  // it.skip('navigates to the forgot-password when clicking forget-password btn',()=>{
  //   cy.get("[data-cy='forgot-password-link']").click()
  //   cy.location('pathname').should('eq','/forgot-password')
  // })
})