/* eslint-disable no-undef */
describe("User can read an article", () => {
  beforeEach(() => {
    cy.intercept("GET", "**api/articles/", {
      fixture: "indexRespondsFromApi.json",
      statusCode: 200,
    }).as("indexApiGetRequest");

    cy.intercept("GET", "**/api/articles/1", {
      fixture: "articleExample.json",
    }).as("showApiGetRequest");

    cy.visit("/");
    cy.get("[data-cy=article-1]").click();
  });

  it("is expected to display the article", () => {
    cy.window().its("store").invoke("dispatch", {
      type: "SET_CURRENT_USER",
      payload: true,
    });
    cy.url().should("eq", "http://localhost:3000/articles/1");
    cy.get("[data-cy=displayed-article]").within(() => {
      cy.get("[data-cy=article-title]").should(
        "contain",
        "Pablo Escobar: Colombia sterilises drug lord's hippos"
      );
      cy.get("[data-cy=article-authors]").should(
        "contain",
        "Bob Journalist, and Bobette Journalist"
      );
      cy.get("[data-cy=article-date]").should("contain", "2021-10-04");
      cy.get("[data-cy=article-body]").should(
        "include.text",
        "A group of hippos - an unwanted legacy following the death of notorious Colombian drug lord Pablo Escobar"
      );
    });
  });

  it("is expected to return to the home page when clicking home page button", () => {
    cy.get("[data-cy=home]").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  describe("when the user in not signed in", () => {
    it("is expected to display a paywall", () => {
      cy.get("[data-cy=paywall]").within(() => {
        cy.get("[data-cy=register-button]").should("be.visible");
        cy.get("[data-cy=sign-in-button]").should("be.visible");
      });
    });
  });
});
