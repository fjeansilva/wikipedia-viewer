{

  let app = {
    searching: false,
    totalResults: 0,
    spinner: document.querySelector('.searching'),
    rowTemplate: document.querySelector('.rowTemplate'),
    containerSearch: document.querySelector('.container-search'),
    searchField: document.getElementById('search'),
    containerResults: document.querySelector('.container-results')
  };

  document.getElementById('btnSearch').addEventListener('click', function(){
    if (app.searchField.value == '') {
      app.searchField.setAttribute('placeholder', 'Type your term :) for search');
    } else {
      app.containerSearch.classList.remove('middle');
      app.search();
    }
  });

  app.search = function(){
    const term = app.searchField.value;
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exlimit=max&explaintext&exintro&gsrlimit=15&generator=search&origin=*&explaintext&gsrsearch=${term}`;

    app.searching = true;
    app.spinner.classList.remove('hide');

    let request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      if (request.readyState == XMLHttpRequest.DONE) {
        if (request.status == 200) {
          app.spinner.classList.add('hide')
          app.clear();
          app.display(request.response)
        }
      }
    };

    request.open('GET', url);
    request.send();
  }

  app.display = function(response) {
    let itens = JSON.parse(response);
    for(let item in itens.query.pages) {
      if (itens.query.pages.hasOwnProperty(item)) {
        app.createTemplate(itens.query.pages[item]);
      }
    }
    document.querySelector('.container-total').removeAttribute('hidden');
  };

  app.clear = function() {
    app.containerResults.innerHTML = '';
  };

  app.createTemplate = function(item) {
    let row = app.rowTemplate.cloneNode(true);
    row.classList.remove('rowTemplate');
    row.removeAttribute('hidden');
    row.querySelector('.media-heading').textContent = item.title;
    row.querySelector('.urlPage').setAttribute('href', `https://en.wikipedia.org/?curid=${item.pageid}`);
    row.querySelector('.description').textContent = item.extract.slice(0, 170).concat('...');
    app.containerResults.appendChild(row);
  };

}
