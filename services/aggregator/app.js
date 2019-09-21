const express = require('express');
const graphqlServer = require('express-graphql');
const { buildSchema } = require('graphql');
const { readFileSync } = require('fs');
const { join } = require('path');
const HttpDataSources = require('./data-sources/HttpDataSources');
const {
  PORT = 4001,
  VERSION = 1,
  ENV = 'dev'
} = process.env;

const app = express();

const schema = getSchema();

const coursesData = [
  {
    id: 1,
    title: 'The Complete Node.js Developer Course',
    author: 'Andrew Mead, Rob Percival',
    taskId: 1
  },
  {
    id: 2,
    title: 'Node.js, Express & MongoDB Dev to Deployment',
    author: 'Brad Traversy',
    taskId: 1
  },
  {
    id: 3,
    title: 'JavaScript: Understanding The Weird Parts',
    author: 'Anthony Alicea',
    taskId: 2
  }
]

const dataSources = new HttpDataSources(ENV);

app.use(
  `/api/v${VERSION}`,
  graphqlServer({
    schema,
    rootValue: {
      courses: getCourses,
      course: getCourse,
      ...dataSources.getDataSources()
    },
    graphiql: true
  })
);


app.listen(
  PORT,
  () => console.log(`Express GraphQL Server Now Running On localhost:${PORT}/api/v${VERSION}`)
);

/**
 * @returns {Schema}
 */
function getSchema() {
  return buildSchema(
    readFileSync(
      join(
        __dirname,
        'schema',
        'appdata.graphql'
      )
    ).toString()
  );
}

function getCourse(args) {
  var id = args.id;
  return coursesData.filter(course => {
    return course.id == id;
  })[0];
}

function getCourses(args) {
  console.log(args);
  if (args.topic) {
    var topic = args.topic;
    return coursesData.filter(course => course.topic === topic);
  } else {
    return coursesData;
  }
}