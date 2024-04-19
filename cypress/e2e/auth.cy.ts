describe("signUP", () => {
  beforeEach(() => {
    cy.visit("/sign-up");
  });
  it("focuses on the first input (name)", () => {
    cy.contains("Đăng kí tài khoản mới");
    cy.get('[data-cy="input-name-sign-up"]').should("have.focus");
  });
  it("shows errors for fields that are empty when submitting the form", () => {
    
    cy.get('[data-cy="form-sign-up"]').find('button[type="submit"]').click({force:true});
    // name
    cy.get('[data-cy="input-name-sign-up"]').as("input-name");
    cy.get("@input-name").should('have.class','focus-visible:ring-red-500')
    
    cy.get("@input-name")
      .next('[data-cy="form-error-msg"]')
      .should("have.text", "Tên phải từ 2 chữ cái");
    // email
    cy.get('[data-cy="input-email-sign-up"]').as("input-email");
    cy.get("@input-email").should('have.class','focus-visible:ring-red-500')
    cy.get("@input-email")
      .next('[data-cy="form-error-msg"]')
      .should("have.text", "Định dạng email không đúng");

    // // password
    cy.get('[data-cy="input-password-sign-up"]').as("input-password");
    cy.get("@input-password").should('have.class','focus-visible:ring-red-500')
    cy.get("@input-password")
      .parent()
      .next('[data-cy="form-error-msg"]')
      .should("have.text", "Mật khẩu phải có ít nhất 6 kí tự");

    // // password-confirm
    cy.get('[data-cy="input-password-confirm-sign-up"]').as(
      "input-password-confirm"
    );
    cy.get("@input-password-confirm").should('have.class','focus-visible:ring-red-500')
    // pass word and password confirm siblings are another buttons
    cy.get("@input-password-confirm")
      .parent()
      .next('[data-cy="form-error-msg"]')
      .should("have.text", "Nhập lại mật khẩu phải có ít nhất 6 kí tự");
  });
  it("change the input type from password to text ", () => {
    cy.get('[data-cy="input-password-sign-up"]').as("input-password");
    cy.get("@input-password").should((el) => {
      expect(el.attr("type")).to.be.eq("password");
    });
    cy.get("@input-password").next('button[type="button"]').click({force:true});
    cy.get("@input-password").should('have.attr','type','text')
  });
  it("navigate to the login page if clicking already have account", () => {
    cy.get("[data-cy='link-to-login-instead']").click({force:true});
    cy.location("pathname").should("eq", "/login");
  });

  //
  it("shows error if the email user tries to register already exist", () => {
   
    const testUserEmail='testuser1@gmail.com'
    cy.get('[data-cy="input-name-sign-up"]').as("input-name").type("Phat");
    cy.get('[data-cy="input-email-sign-up"]')
      .as("input-email")
      .type(testUserEmail);
    cy.get('[data-cy="input-password-sign-up"]')
      .as("input-password")
      .type("test12345");
    cy.get('[data-cy="input-password-confirm-sign-up"]')
      .as("input-password-confirm")
      .type("test12345");
    cy.get("form").contains("Đăng kí").as("submitBtn");
    cy.get("@submitBtn").click();
    cy.contains("Email này đã đăng kí rồi. Thử đăng nhập lại nhé.");
  });
  it("signup successfully and shows success message then navigate to the verifyEmail Page", () => {
    const emailSentTo = "exampleEmail@gmail.com";
    // cy.clock()
    cy.intercept("POST", "/api/trpc/auth.signUp?batch=1", {
      statusCode: 200,
      body: {
        result: {
          data: {
            success: true,
            emailSentTo,
          },
        },
      },
    }).as("signUpProcess");

    cy.get('[data-cy="input-name-sign-up"]').as("input-name").type("Phattran");
    cy.get('[data-cy="input-email-sign-up"]')
      .as("input-email")
      .type(emailSentTo);
    cy.get('[data-cy="input-password-sign-up"]')
      .as("input-password")
      .type("mypassword123");
    cy.get('[data-cy="input-password-confirm-sign-up"]')
      .as("input-password-confirm")
      .type("mypassword123");
    cy.get("form").contains("Đăng kí").as("submitBtn");
    cy.get("@submitBtn").click();
    // cy.wait('@signUpProcess')
    cy.contains(`Link xác nhận đã được gửi đến email ${emailSentTo}`);
    // cy.tick(1000)
    cy.location("pathname").should("eq", "/verify-email");
    cy.location("search").should("eq", `?toEmail=${emailSentTo}`);
  });
});

describe("login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });
  it("focuses on the first input (email)", () => {
    cy.contains("Đăng nhập");
    cy.get('[data-cy="input-email-login"]').should("have.focus");
  });
  it("shows errors for fields that are empty when submitting the form", () => {
    cy.get("form").find("button").contains("Đăng nhập").click({force:true});

    // email
    cy.get('[data-cy="input-email-login"]').as("input-email");
    cy.get("@input-email").should('have.class','focus-visible:ring-red-500')
    cy.get("@input-email")
      .next('[data-cy="form-error-msg"]')
      .should("have.text", "Định dạng email không đúng");

    // // password
    cy.get('[data-cy="input-password-login"]').as("input-password");
    cy.get("@input-password").should('have.class','focus-visible:ring-red-500')
    cy.get("@input-password")
      .parent()
      .next('[data-cy="form-error-msg"]')
      .should("have.text", "Mật khẩu phải có ít nhất 6 kí tự");
  });
  it("navigates to the forgot-password when clicking forget-password btn", () => {
    cy.get("[data-cy='forgot-password-link']").click({force:true});
    cy.location("pathname").should("eq", "/forgot-password");
  });
  it("navigates to the login page when clicking not have an account yet", () => {
    cy.get("a").contains("Chưa có tài khoản. Đăng kí ngay →").click({force:true});

    cy.location("pathname").should("eq", "/sign-up");
  });
  it("says please verify email first if the email isnot verified", () => {
    cy.intercept("POST", "/api/trpc/auth.login?batch=1", {
      statusCode: 403,
      body: {
        error: {
          message: "Vui lòng xác nhận email.",
          code: -32001,
          data: {
            code: "FORBIDDEN",
            httpStatus: 403,
          },
        },
      },
    });
    cy.get('[data-cy="input-email-login"]')
      .as("input-email")
      .type("email@gmail.com");
    cy.get('[data-cy="input-password-login"]')
      .as("input-password")
      .type("password12345");
    cy.get("form").submit();
    cy.contains("Vui lòng xác nhận email.");
  });

  it("says wrong password or email if invalid credential was given", () => {
    cy.intercept("POST", "/api/trpc/auth.login?batch=1", {
      statusCode: 401,
      body: {
        error: {
          message: "Tài khoản hoặc mật khẩu sai.",
          code: -32001,
          data: {
            code: "UNAUTHORIZED",
            httpStatus: 401,
          },
        },
      },
    });
    cy.get('[data-cy="input-email-login"]')
      .as("input-email")
      .type("email@gmail.com");
    cy.get('[data-cy="input-password-login"]')
      .as("input-password")
      .type("password12345");
    cy.get("form").submit();
    cy.contains("Tài khoản hoặc mật khẩu sai.");
  });
  it("login successfully it the credential was correct and navigate", () => {
   
    const origin = "my-profile";
    cy.visit(`/login?origin=${origin}`);
    cy.get('[data-cy="input-email-login"]')
      .as("input-email")
      .type("testuser1@gmail.com");
    cy.get('[data-cy="input-password-login"]')
      .as("input-password")
      .type("test12345");
    cy.get("form").submit();
    cy.contains("Đăng nhập thành công");
    // if have origin come from other place to login
    cy.location("pathname").should("eq", `/${origin}`);
  });
  // Login by phoneNumber
  it.only('login by phoneNumber',()=>{
    cy.get("[data-cy='login-by-phone-number-alternative']").contains('Đăng nhập bằng số điện thoại').as('button-trigger-open')
    cy.get('@button-trigger-open').click({force:true})

    cy.get("[data-cy='login-by-phone-number-form']").as('login-by-phone-number-form')
    cy.get("[data-cy='login-by-phone-number-submit-btn']").as('login-by-phone-number-submit-btn')
    cy.get('@login-by-phone-number-form').contains("Đăng nhập bằng số điện thoại")
    // invalid phone number
    cy.get('@login-by-phone-number-form').find('input').type('038')
    // try to submit with invalid form number
    cy.get('@login-by-phone-number-submit-btn').click()
    cy.contains("Vui lòng nhập đúng định dạng số điện thoại")
    // delete the old one
    cy.get('@login-by-phone-number-form').find('input').type('{selectAll}{del}')
    // type the valid one
    cy.get('@login-by-phone-number-form').find('input').type('0386325681')
    // submit
    cy.get('@login-by-phone-number-submit-btn').click()
    // ===> otp verification shown

    cy.get("[data-cy='otp-verification-container']").as('otp-verification-container')
    cy.get("[data-cy='otp-verification-form']").as('otp-verification-container-form')
    // expect 6 input because the otp is 6 characters long
    cy.get('@otp-verification-container-form').find('input').as('otp-inputs')
    cy.get("[data-cy='otp-verification-submit-btn']").as('otp-submit-btn')
    cy.get("[data-cy='otp-verification-send-again-btn']").as('otp-send-again-btn')
    cy.get("[data-cy='otp-verification-change-another-phone-number-btn']").as('change-another-phone-number-btn')
    cy.get('@otp-inputs').should('have.length',6)
 
    // change to phone number send request 
    cy.get('@change-another-phone-number-btn').click()
    // the verification should not exist
    cy.get('@otp-verification-container').should('not.exist')
    // get the phone number form
    cy.get('@login-by-phone-number-form')
    // go again to the verification
    cy.get('@login-by-phone-number-form').find('input').type('0386325681')

    cy.get('@login-by-phone-number-submit-btn').click()

    // the submit button must be disabled
    cy.get('@otp-submit-btn').should('be.disabled')
    // typing otp  expect true with the api

    // false case first
    cy.get('@otp-inputs').eq(0).type('0')
    cy.get('@otp-inputs').eq(1).type('0')
    cy.get('@otp-inputs').eq(2).type('0')
    cy.get('@otp-inputs').eq(3).type('0')
    cy.get('@otp-inputs').eq(4).type('0')
    cy.get('@otp-inputs').eq(5).type('1')

    cy.get('@otp-submit-btn').should('not.be.disabled')
    cy.get('@otp-submit-btn').click() 
    cy.contains("Mã OTP không đúng")
    
    // request to send otp again
    cy.get("@otp-send-again-btn").click()
    cy.contains("OTP đã được gửi lại vào số điện thoại của bạn")
    // now it should be correct
    cy.get('@otp-inputs').eq(5).type('0')
    cy.get('@otp-submit-btn').click() 

    cy.contains("Xác thực thành công")

    cy.location('pathname').should('eq','/')
  })
});
describe("forgot-password", () => {
  beforeEach(() => {
    cy.visit("/forgot-password");
  });
  it("focuses on the first input (email)", () => {
    cy.contains("Lấy lại mật khẩu");
    cy.get('[data-cy="input-email-forgot-password"]').should("have.focus");
  });
  it("shows only 1 path in the breadcrumbs link if i enter the path directly", () => {
    // the home page and the actual path url
    cy.get('[data-cy="breadcrumb-list-item"]').should("have.length", 2);
  });
  it("shows only 2 path in the breadcrumbs link if i navigate from login", () => {
    cy.visit("/login");
    cy.get("[data-cy='forgot-password-link']").click({force:true});
  
    // the home page and  the login page the actual path url
    cy.get('[data-cy="breadcrumb-list-item"]').should("have.length", 3);
  });
  // it("shows errors for fields that are empty when submitting the form", () => {
  //   cy.get('form').contains("Đăng nhập").click();

  //   // email
  //   cy.get('[data-cy="input-email-login"]').as("input-email");
  //   cy.get("@input-email").should('have.class','focus-visible:ring-red-500')
  //   cy.get('@input-email').next('[data-cy="form-error-msg"]').should('have.text',"Định dạng email không đúng")

  //   // // password
  //   cy.get('[data-cy="input-password-login"]').as("input-password");
  //   cy.get("@input-password").should('have.class','focus-visible:ring-red-500')
  //   cy.get('@input-password').parent().next('[data-cy="form-error-msg"]').should('have.text',"Mật khẩu phải có ít nhất 6 kí tự")

  // });
  it.skip('navigates to the forgot-password when clicking forget-password btn',()=>{
    cy.get("[data-cy='forgot-password-link']").click({force:true})
    cy.location('pathname').should('eq','/forgot-password')
  })
});

describe("verify-email", () => {
  beforeEach(() => {
    cy.visit("/verify-email");
  });
  it("shows check your email and your email address that just being sent to", () => {
    const email = "exampleEmail@gmail.com";
    cy.visit(`/verify-email?toEmail=${email}`);

    cy.contains("Kiểm tra email của bạn");
    cy.get("[data-cy='email-icon-verify-email']");
    cy.contains("Link xác thực tài khoản đã được gửi đến email của bạn");
    cy.contains(email);
    cy.get('a[href="/"]').contains("Trở lại trang chủ");
  });
});


// describe.only('my-profile',()=>{
//   beforeEach(()=>{
//     cy.visit('/my-profile')
//   })
//   it('redirects if no payloadtoken in the cookies',()=>{
//     cy.getCookie('payload-token').then((cookie)=>{
//       expect(cookie).to.be.null
//     })
//     cy.wait('',{})
//   })
// })