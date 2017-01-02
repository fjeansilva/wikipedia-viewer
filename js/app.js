{

  let app = {
    searching: false,
    totalResults: 0,
    spinner: document.querySelector('.searching'),
    rowTemplate: document.querySelector('.template'),
    containerSearch: document.querySelector('.search-form'),
    searchField: document.querySelector('.search'),
    containerResults: document.querySelector('.search-result')
  };

  document.querySelector('.btn-search').addEventListener('click', function(){
    if (app.searchField.value == '') {
      app.searchField.setAttribute('placeholder', 'Type your term for search :)');
    } else {
      app.containerSearch.classList.remove('start-position');
      app.search();
    }
  });

  document.querySelector('.btn-random').addEventListener('click', function(){
    window.open('https://en.wikipedia.org/wiki/Special:Random', '_blank');
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
    document.querySelector('.search-result-total').removeAttribute('hidden');
  };

  app.clear = function() {
    app.containerResults.innerHTML = '';
  };

  app.createTemplate = function(item) {
    let row = app.rowTemplate.cloneNode(true);
    row.classList.remove('template');
    row.removeAttribute('hidden');
    row.querySelector('.template-title').textContent = item.title;
    row.querySelector('.template-url').setAttribute('href', `https://en.wikipedia.org/?curid=${item.pageid}`);
    row.querySelector('.template-description').textContent = item.extract.slice(0, 170).concat('...');
    app.containerResults.appendChild(row);
  };

}
