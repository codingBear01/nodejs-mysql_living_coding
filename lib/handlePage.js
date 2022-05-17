import url from 'url';
import qs from 'querystring';
import sanitizeHtml from 'sanitize-html';
import db from './db.js';
import template from './template.js';

export const index = (request, response) => {
  db.query('SELECT * FROM topic', function (error, results) {
    if (error) throw error;
    const title = 'Welcome';
    const description = 'Hello, Node.js';
    const list = template.list(results);
    const html = template.HTML(
      title,
      list,
      `<h2>${sanitizeHtml(title)}</h2>
      ${sanitizeHtml(description)}`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
};

export const renderOnePage = (request, response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;

  db.query('SELECT * FROM topic', function (error, results) {
    if (error) throw error;
    // let sql = `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=${db.escape(
    //   queryData.id
    // )}`;
    // db.query(sql, [queryData.id], function (error2, topic) {
    db.query(
      `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
      [queryData.id],
      function (error2, topic) {
        if (error2) throw error2;
        const title = topic[0].title;
        const description = topic[0].description;
        const list = template.list(results);
        const html = template.HTML(
          title,
          list,
          `<h2>${sanitizeHtml(title)}</h2>
          ${sanitizeHtml(description)}
          <p>
            by ${sanitizeHtml(topic[0].name)}
          </p>
          `,
          ` <a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete">
            </form>`
        );
        response.writeHead(200);
        response.end(html);
      }
    );
  });
};

export const createPage = (request, response) => {
  db.query('SELECT * FROM topic', function (error, results) {
    if (error) throw error;
    db.query('SELECT * FROM author', function (error2, authors) {
      if (error2) throw error2;
      const title = 'Create Page';
      const list = template.list(results);

      const html = template.HTML(
        title,
        list,
        `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
      `,
        `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

export const createPageProcess = (request, response) => {
  let body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    const post = qs.parse(body);
    db.query(
      `
      INSERT INTO topic (title, description, created, author_id) 
      VALUES(?, ?, NOW(), ?);`,
      [post.title, post.description, post.author],
      function (error, result) {
        if (error) throw error;
        response.writeHead(302, { Location: `/?id=${result.insertId}` });
        response.end();
      }
    );
  });
};

export const updatePage = (request, response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;

  db.query('SELECT * FROM topic', function (error, results) {
    if (error) throw error;
    db.query(
      `SELECT * FROM topic WHERE id=?`,
      [queryData.id],
      function (error2, result) {
        if (error2) throw error2;
        db.query('SELECT * FROM author', function (error3, authors) {
          if (error3) throw error3;

          const list = template.list(results);
          const html = template.HTML(
            result[0].title,
            list,
            `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${result[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${
              result[0].title
            }"></p>
            <p>
              <textarea name="description" placeholder="description">${
                result[0].description
              }</textarea>
            </p>
            <p>
              ${template.authorSelect(authors, result[0].author_id)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
            `<a href="/create">create</a> <a href="/update?id=${result[0].id}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      }
    );
  });
};

export const updatePageProcess = (request, response) => {
  let body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    const post = qs.parse(body);
    db.query(
      'UPDATE topic SET title=?, description=?, author_id=? WHERE id=?',
      [post.title, post.description, post.author, post.id],
      function (error, result) {
        if (error) throw error;
        response.writeHead(302, { Location: `/?id=${post.id}` });
        response.end();
      }
    );
  });
};

export const deletePage = (request, response) => {
  let body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    const post = qs.parse(body);
    db.query(
      'DELETE FROM topic WHERE id=?',
      [post.id],
      function (error, result) {
        if (error) throw error;
        response.writeHead(302, { Location: `/` });
        response.end();
      }
    );
  });
};
