const yaml = require('yaml');
const { readFileSync } = require('fs');
const { join } = require('path');
const fetch = require('node-fetch');

class HttpDataSources {
  constructor(env) {
    const dataSourcesYaml =
      readFileSync(
        join(
          __dirname,
          '..',
          'configs',
          `data-sources.${env}.yaml`
        )
      ).toString();
    this.parsedYaml = yaml.parseDocument(dataSourcesYaml).toJSON();
  }

  getDataSources() {
    let dataSource = {};
    Object.keys(this.parsedYaml.Query).forEach(query => {
      const { METHOD, URL } = this.parsedYaml.Query[query];
      dataSource[query] = getIntegration(METHOD, URL);
    });

    Object.keys(this.parsedYaml.Mutation).forEach(mutation => {
      const { METHOD, URL } = this.parsedYaml.Mutation[mutation];
      dataSource[mutation] = getIntegration(METHOD, URL);
    });
    return dataSource;
  }
}

module.exports = HttpDataSources;


function getIntegration(method, path) {
  switch (method) {
    case 'POST': return getPostIntegration(path);
    case 'GET': return getHttpGetIntegration(path);
  }
}

function getPostIntegration(path) {
  return args => {
    return fetch(
      path,
      {
        method: 'post',
        body: JSON.stringify(args),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(res => res.json());
  }
}

function getHttpGetIntegration(path) {
  return args => {
    const query = Object.keys(args).map(arg => `${arg}=${args[arg]}`).join('&');
    return fetch(`${path}?${query}`, { method: 'get' })
      .then(res => res.json());
  }
}
