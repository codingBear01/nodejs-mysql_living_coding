import url from 'url';
import db from './db.js';
import qs from 'querystring';
import template from './template.js';

export const authorTable = (request, response) => {
  db.query('SELECT * FROM topic', function (error, results) {
    if (error) throw error;

    db.query('SELECT * FROM author', function (error2, authors) {
      if (error2) throw error2;
      const title = 'Author';
      const list = template.list(results);
      const html = template.HTML(
        title,
        list,
        `
        <table>
          <thead>
            <tr>
              <td>name</td>
              <td>profile</td>
              <td>update</td>
              <td>delete</td>
              </tr>
          </thead>
          ${template.showAuthorTable(authors)}
        </table>
        `,
        `<a href="/create_author">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

export const createAuthor = (request, response) => {
  db.query('SELECT * FROM topic', function (error, results) {
    if (error) throw error;
    const title = 'Create Author';
    const list = template.list(results);
    const html = template.HTML(
      title,
      list,
      `
        <form action="/create_author_process" method="post">
          <p><input type="text" name="author_name" placeholder="name"></p>
          <p>
            <textarea name="profile" placeholder="profile"></textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
      `,
      `<a href="/create_author">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
};

export const createAuthorProcess = (request, response) => {
  let body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    const post = qs.parse(body);
    db.query(
      `
      INSERT INTO author (name, profile) 
      VALUES(?, ?);`,
      [post.author_name, post.profile],
      function (error, result) {
        if (error) throw error;
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};

export const updateAuthor = (request, response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;

  db.query('SELECT * FROM topic', function (error, results) {
    if (error) throw error;
    db.query(
      `SELECT * FROM author WHERE id=?`,
      [queryData.id],
      function (error2, author) {
        if (error2) throw error2;
        const list = template.list(results);
        const html = template.HTML(
          `Update Author: ${author[0].name}`,
          list,
          `
          <form action="/update_author_process" method="post">
            <input type="hidden" name="id" value="${author[0].id}">
            <p><input type="text" name="author_name" placeholder="name" value="${author[0].name}"></p>
            <p>
              <textarea name="profile" placeholder="profile">${author[0].profile}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `
          <a href="/create_author">create</a>
          `
        );
        response.writeHead(200);
        response.end(html);
      }
    );
  });
};

export const updateAuthorProcess = (request, response) => {
  let body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    const post = qs.parse(body);
    db.query(
      'UPDATE author SET name=?, profile=? WHERE id=?',
      [post.author_name, post.profile, post.id],
      function (error, result) {
        if (error) throw error;
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};

export const deleteAuthor = (request, response) => {
  let body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    const post = qs.parse(body);
    db.query(
      `DELETE FROM author WHERE id=?`,
      [post.id],
      function (error, result) {
        if (error) throw error;
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};
