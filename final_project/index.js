const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js');   // import router directly
const genl_routes = require('./router/general.js');          // import router directly

const app = express();
app.use(express.json());

// Session middleware
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Authentication middleware placeholder
app.use("/customer/auth/*", function auth(req, res, next) {
  // TODO: implement authentication logic
  next();
});

const PORT = 5000;

// Mount routers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
