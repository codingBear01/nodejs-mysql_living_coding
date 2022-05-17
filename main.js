import http from 'http';
import url from 'url';
import * as handlePage from './lib/handlePage.js';
import * as handleAuthor from './lib/handleAuthor.js';

const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      handlePage.index(request, response);
    } else {
      handlePage.renderOnePage(request, response);
    }
  } else if (pathname === '/create') {
    handlePage.createPage(request, response);
  } else if (pathname === '/create_process') {
    handlePage.createPageProcess(request, response);
  } else if (pathname === '/update') {
    handlePage.updatePage(request, response);
  } else if (pathname === '/update_process') {
    handlePage.updatePageProcess(request, response);
  } else if (pathname === '/delete_process') {
    handlePage.deletePage(request, response);
  } else if (pathname === '/author') {
    handleAuthor.authorTable(request, response);
  } else if (pathname === '/create_author') {
    handleAuthor.createAuthor(request, response);
  } else if (pathname === '/create_author_process') {
    handleAuthor.createAuthorProcess(request, response);
  } else if (pathname === '/update_author') {
    handleAuthor.updateAuthor(request, response);
  } else if (pathname === '/update_author_process') {
    handleAuthor.updateAuthorProcess(request, response);
  } else if (pathname === '/delete_author') {
    handleAuthor.deleteAuthor(request, response);
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
