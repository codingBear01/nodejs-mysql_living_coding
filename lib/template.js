import url from 'url';

const template = {
  HTML: function (title, list, body, control) {
    return `
    <!doctype html>
    <html>
    <head>
      <style>
        table{
          border-collapse: collapse;
          border-spacing: 0;
        }
        th, td{
            padding: 10px 20px;
            border: 1px solid #000;
        }
      </style>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
      </head>
      <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },

  list: function (results) {
    let list = '<ul>';
    let i = 0;
    while (i < results.length) {
      list =
        list +
        `<li><a href="/?id=${results[i].id}">${results[i].title}</a></li>`;
      i++;
    }
    list = list + '</ul>';
    return list;
  },

  authorSelect: function (authors, author_id) {
    let tag = '';

    authors.forEach((author) => {
      let selected = '';
      if (author.id === author_id) selected = ' selected';
      tag += `<option value="${author.id}"${selected}>${author.name}</option>`;
    });

    return `
      <select name="author">
        ${tag}
      </select>
    `;
  },

  showAuthorTable: function (authors) {
    let tag = '';

    authors.forEach((author) => {
      tag += `
      <tr>
          <td>${author.name}</td>
          <td>${author.profile}</td>
          <td>
            <a href="/update_author?id=${author.id}">update</a>
          </td>
          <td>
            <form action="/delete_author" method="post">
              <input type="hidden" name="id" value="${author.id}">
              <input type="submit" value="delete" />
            </form>
          </td>
      </tr>
      `;
    });

    return tag;
  },
};

export default template;
