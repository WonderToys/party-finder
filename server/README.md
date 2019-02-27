Party Finder (Server)
-----

This is the backend server for the Party Finder app. Note that this is still in early development and not quite ready for any sort of production use. There is also no
client yet so everything must be done through the graphiql found at /graphql. I will update this readme with installation and running instructions once this is ready
for even an alpha run :)

### Technologies

- GraphQL with [apollo-server](https://github.com/apollographql/apollo-server)
- [fastify](https://github.com/fastify/fastify) for the http server
- [MongoDB](https://github.com/mongodb/mongo) for the database
- [Mongoose](https://github.com/Automattic/mongoose) for the Mongo ODM