export default {
  goToPartnerDetail() {
    cy.waitGet('table > tbody > tr:nth-child(2) > td:nth-child(1) > div > a').click({
      force: true,
    });
  },
  panel: {
    closePanel() {
      cy.waitGet('.cd-panel__header > a').click({ force: true });
    },
    isVisible() {
      cy.waitGet('.cd-panel').should('have.class', 'cd-panel--is-visible');
    },
  },
  modal: {
    isVisible() {
      cy.waitGet('.modal-container').should('be.visible');
    },
    saveButton() {
      cy.waitGet('.modal-default-button.btn.btn-success').click({ force: true });
    },
    cancelButton() {
      cy.waitGet('.modal-default-button.btn.btn-danger').click({ force: true });
    },
  },
  tabs: {
    goToTab(tabName, tabUrl) {
      cy.waitGet('div.mt-4 ol.tabs-bar > li > a')
        .contains(tabName)
        .click({ force: true });
      cy.url().should('include', tabUrl);
    },
    goToSection(sectionName, sectionUrl) {
      cy.waitGet('div.mt-4 ul.list-group > li > a')
        .contains(sectionName)
        .click({ force: true });
      cy.url().should('include', sectionUrl);
    },
    userManagement: {
      goTo() {
        cy.waitGet('div.mt-4.mb-4.bottom-space > div.tabs > ol > li:nth-child(1) > a').click({
          force: true,
        });
        cy.url().should('include', '/users');
      },
      administrators: {
        goTo() {
          cy.waitGet('ul.list-group > li:nth-child(1) > a').click({ force: true });
          cy.url().should('include', '/users/admins');
        },
        clickEditButton() {
          cy.waitGet(
            '.pt-4.pl-4 > div > div.col-md-9 > div > div:nth-child(1) > div.cardBloc-buttons > button.btn.btn-primary'
          ).click({ force: true });
        },
        verifyName(newFirstname) {
          cy.waitGet('div.cardBloc:nth-child(1) > .cardBloc-infos > .cardBloc-infos-name').should(
            ($name) => {
              const nameText = $name
                .text()
                .trim()
                .split(' ');
              const firstname = nameText[0];
              expect(firstname, 'Prenom').to.equal(newFirstname);
            }
          );
        },
        edit: {
          firstname(newFirstname) {
            cy.waitGet(
              '.data-detail-container.main-content > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div > input'
            )
              .clear()
              .type(newFirstname);
          },
        },
      },
      users: {
        goTo() {
          cy.waitGet('ul.list-group > li:nth-child(2) > a').click({ force: true });
          cy.url().should('include', '/users/users');
        },
        clickEditButton() {
          cy.waitGet(
            '.pt-4.pl-4 > div > div.col-md-9 > div > div.cards > div.cardBloc > div.cardBloc-buttons > button.btn.btn-primary'
          )
            .first()
            .click({ force: true });
        },
        verifyName(newFirstname) {
          cy.waitGet('.cards > div.cardBloc > div.cardBloc-infos > div.cardBloc-infos-name').should(
            ($name) => {
              const nameText = $name
                .text()
                .trim()
                .split(' ');
              const firstname = nameText[0];
              expect(firstname, 'Prenom').to.equal(newFirstname);
            }
          );
        },
        clickAddNewUserButton() {
          cy.waitGet('.addNew').click({ force: true });
        },
        edit: {
          firstname(newFirstname) {
            cy.waitGet(
              '.data-detail-container.main-content > div > div:nth-child(4) > div:nth-child(1) > div > input'
            )
              .clear()
              .type(newFirstname);
          },
        },
      },
    },
    customization: {
      goTo() {
        cy.waitGet('div.mt-4.mb-4.bottom-space > div.tabs > ol > li:nth-child(2) > a').click({
          force: true,
        });
        cy.url().should('include', '/customize');
      },
      mailingList: {
        goTo() {
          cy.waitGet('ul.list-group > li:nth-child(1) > a').click({ force: true });
          cy.url().should('include', '/customize/broadcastlists');
        },
        clickAddNewListButton() {
          cy.waitGet('.addNew').click({ force: true });
        },
        clickEditButton() {
          cy.waitGet(
            '.pt-4.pl-4 > div > div.col-md-9 > div > div > div:nth-child(6) > div.cardBloc-buttons > button.btn.btn-primary'
          ).click({ force: true });
        },
        clickDeleteButton() {
          cy.waitGet(
            '.pt-4.pl-4 > div > div.col-md-9 > div > div > div:nth-child(6) > div.cardBloc-buttons > button.button.btn.btn-import'
          ).click({ force: true });
        },
        confirmDelete() {
          cy.waitGet('.modal-default-button.btn.btn-success.btn-sm.ml-1').click({ force: true });
        },
        listDontExist(name) {
          cy.contains(name).should('not.exist');
        },
        verifyList(name, email) {
          cy.waitGet(
            '.pt-4.pl-4 > div > div.col-md-9 > div > div > div:nth-child(6) > div.cardBloc-infos > div.cardBloc-infos-name'
          ).should(($name) => {
            const nameText = $name.text();
            expect(nameText, 'Name').to.equal(name);
          });
          cy.waitGet(
            '.pt-4.pl-4 > div > div.col-md-9 > div > div > div:nth-child(6) > div.cardBloc-infos > div.cardBloc-infos-username'
          ).should(($email) => {
            const emailText = $email.text().trim();
            expect(emailText, 'Email').to.equal(email);
          });
        },
        edit: {
          name(name) {
            cy.waitGet(
              '.data-detail-container.main-content > div > div:nth-child(1) > div > div > input'
            )
              .clear()
              .type(name);
          },
          email(email) {
            cy.waitGet(
              '.data-detail-container.main-content > div > div:nth-child(2) > div > div > div > div > ul > li.ti-new-tag-input-wrapper > input'
            ).type(email + '{enter}');
          },
        },
      },
      deliveryAddresses: {
        goTo() {
          cy.waitGet('ul.list-group > li:nth-child(2) > a').click({ force: true });
          cy.url().should('include', '/customize/deliveryaddress');
        },
        clickAddNewDeliveryAddress() {
          cy.waitGet('.addNew').click({ force: true });
        },
        verifyCreationNewDeliveryAddress() {
          cy.contains('Firstname Name').should('exist');
        },
        edit: {
          mister() {
            cy.waitGet(
              '.data-detail-container.main-content > div > div:nth-child(2) > div > label.radio-container.mr-3 > input[type=radio]'
            ).click({ force: true });
          },
          name(name) {
            cy.waitGet('.data-detail-container.main-content > div > div:nth-child(3) > input').type(
              name
            );
          },
          firstname(firstname) {
            cy.waitGet('.data-detail-container.main-content > div > div:nth-child(4) > input').type(
              firstname
            );
          },
          phone(phone) {
            cy.waitGet(
              '.data-detail-container.main-content > div > div:nth-child(5) > div:nth-child(1) > div > input'
            ).type(phone);
          },
          email(email) {
            cy.waitGet(
              '.data-detail-container.main-content > div > div:nth-child(5) > div:nth-child(2) > div > input'
            ).type(email);
          },
          company(company) {
            cy.waitGet('.data-detail-container.main-content > div > div:nth-child(6) > input').type(
              company
            );
          },
          address(address) {
            cy.waitGet(
              '.data-detail-container.main-content > div > div.position-relative > fieldset > input'
            ).type(address);
          },
          postalCode(postalCode) {
            cy.waitGet(
              '.data-detail-container.main-content > div > div:nth-child(9) > div:nth-child(1) > div > input'
            ).type(postalCode);
          },
          city(city) {
            cy.waitGet(
              '.data-detail-container.main-content > div > div:nth-child(9) > div:nth-child(2) > div > input'
            ).type(city);
          },
          country(country) {
            cy.waitGet(
              '.data-detail-container.main-content > div > div:nth-child(9) > div:nth-child(3) > div > div > div > fieldset > input'
            )
              .click({ force: true })
              .type(country)
              .wait(400)
              .waitGet('.autocomplete-result')
              .click({ force: true });
          },
        },
      },
      customFields: {
        goTo() {
          cy.waitGet('ul.list-group > li:nth-child(3) > a').click({ force: true });
          cy.url().should('include', '/customize/customfields');
        },
        verifyNewCustomFieldTitle(title) {
          cy.waitGet('.cardBloc-infos-username-title')
            .last()
            .should(($title) => {
              const titleText = $title.text().trim();
              expect(titleText, 'Title').to.equal(title);
            });
        },
        save() {
          cy.waitGet('div.footer-panel-buttons > div > div:nth-child(2) > button')
            .click({
              force: true,
            })
            .wait(400);
        },
      },
      specificFields: {
        goTo() {
          cy.waitGet('ul.list-group > li:nth-child(4) > a').click({ force: true });
          cy.url().should('include', '/customize/specificfields');
        },
      },
      fields: {
        clickAddNewButton() {
          cy.waitGet('.addNew').click({ force: true });
        },
        clickEditButtonLastChild() {
          cy.waitGet('.cards')
            .find('button.btn.btn-primary')
            .last()
            .click({ force: true });
        },
        edit: {
          title(title) {
            cy.waitGet('.data-detail-container > div > label > input[type=text]')
              .clear()
              .type(title);
          },
          typeText() {
            cy.waitGet(
              '.data-detail-container > div > div:nth-child(2) > div.buttons-group-container > div > button:nth-child(1)'
            ).click({ force: true });
          },
          mandatoryOnActivation() {
            cy.waitGet(
              '.data-detail-container > div > div:nth-child(3) > div:nth-child(3) > div:nth-child(1) > .checkbox-container > label > span'
            ).click({ force: true });
          },
          save() {
            cy.waitGet('.footer-panel-buttons > div > div:nth-child(2) > button').click({
              force: true,
            });
          },
        },
      },
    },
    billingAccount: {
      goTo() {
        cy.waitGet('div.mt-4.mb-4.bottom-space > div.tabs > ol > li:nth-child(3) > a').click({
          force: true,
        });
        cy.url().should('include', '/billAccounts');
      },
      clickCodeFirstLine() {
        cy.waitGet('table > tbody > tr:nth-child(1) > td:nth-child(1) > div > span > a').click({
          force: true,
        });
      },
      verifyLabelFirstLine(label) {
        cy.waitGet('table > tbody > tr:nth-child(1) > td:nth-child(2) > div').should(($label) => {
          const labelText = $label.text().trim();
          expect(labelText, 'Label').to.equal(label);
        });
      },
      edit: {
        label(label) {
          cy.waitGet('.billAccounts-bloc-content-flex:nth-child(1) > div:nth-child(2) > input')
            .clear()
            .type(label);
        },
        taxArea(taxArea) {
          cy.waitGet(
            'div.col-md-9 > div > div:nth-child(4) > div > div:nth-child(5) > div > div > div > fieldset > input'
          )
            .clear()
            .type(taxArea);
        },
        return() {
          cy.waitGet('.list-group-item > a').click({ force: true });
        },
      },
    },
    offersAndSimCards: {
      goTo() {
        cy.waitGet('div.mt-4.mb-4.bottom-space > div.tabs > ol > li:nth-child(4) > a').click({
          force: true,
        });
        cy.url().should('include', '/offersandsim');
      },
      manageButton() {
        cy.waitGet('.addNew').click({ force: true });
      },
      unselectButtonFirstCard() {
        cy.waitGet('.cards')
          .find('button.btn.btn-import')
          .first()
          .click({ force: true });
      },
      offers: {
        goTo() {
          cy.waitGet('ul.list-group > li:nth-child(1) > a').click({ force: true });
          cy.url().should('include', '/offersandsim/offersCards');
        },
      },
      simCards: {
        goTo() {
          cy.waitGet('ul.list-group > li:nth-child(2) > a').click({ force: true });
          cy.url().should('include', '/offersandsim/simcards');
        },
      },
    },
    accountDetails: {
      goTo() {
        cy.waitGet('div.mt-4.mb-4.bottom-space > div.tabs > ol > li:nth-child(5) > a').click({
          force: true,
        });
        cy.url().should('include', '/accountDetail');
      },
      descriptionOfPartnerAccount: {
        goTo() {
          cy.waitGet('ul.list-group > li:nth-child(1) > a').click({ force: true });
          cy.url().should('include', '/accountDetail/description');
        },
      },
      partnerOptions: {
        goTo() {
          cy.waitGet('ul.list-group > li:nth-child(2) > a').click({ force: true });
          cy.url().should('include', '/accountDetail/options');
        },
        clickEsimToggle() {
          cy.waitGet(
            'div.col-md-9 > div > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(1) > div > label > span.slider'
          ).click({ force: true });
        },
        save() {
          cy.wait(800);
          cy.waitGet(
            '#app > div.container > div.mt-4 > div.mt-4.mb-4.bottom-space > div.pt-4.pl-4 > div > div.col-md-9 > div > div.d-flex > div > button'
          ).click({ force: true });
        },
      },
    },
  },
};
