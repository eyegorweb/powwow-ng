export function waitForGQL(queryName, onQueryFoundFn) {
  function waitOnce() {
    cy.wait('@gql-call').then(xhr => {
      console.log(xhr.requestBody.query);
      if (xhr.requestBody && xhr.requestBody.query.includes(queryName)) {
        if (onQueryFoundFn) onQueryFoundFn(xhr);
      } else {
        waitOnce();
      }
    });
  }

  waitOnce();
}
