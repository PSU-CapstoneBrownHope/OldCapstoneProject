import express from 'express';
import routes from './index';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import swaggerJSDocs from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const fileStore = require('session-file-store')(session);
const app = express();
const port = process.env.PORT || 8080;
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'BRF API',
      description: 'API Information for BRF Application',
      contact: {
        name: "Black Resource Fund"
      },
      servers: ["http://localhost:8080"]
    }
  },
  apis: ['./src/routes/*.ts']
};

const swaggerDocs = swaggerJSDocs(swaggerOptions);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  'store': new fileStore({ttl: 600}),
  'secret': 'gfr456$^(%$jfkderfg',
  'resave': true,
  'saveUninitialized': true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(routes);

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});

module.exports = server;
