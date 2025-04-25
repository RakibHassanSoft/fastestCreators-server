
const gigsRouter = require("../models/gig/gig.routes");
const ordeRouter = require("../models/order/order.routes");
const serviceRouter = require("../models/service/service.routes");
const userRouter = require("../models/user/user.routes");
const contractUsRouter = require("../models/contractUs/contractUs.route");
const blogRouter = require("../models/blog/blog.route");
const paymentRouter = require("../models/Payment/payment.routes");

const routes = [
    {
      path: '/users',
      handler: userRouter,
    },
    {
      path: '/services',
      handler: serviceRouter,
    },
    {
      path: '/gigs',
      handler: gigsRouter,
    },
    {
      path: '/orders',
      handler: ordeRouter,
    },
    {
      path: '/contracts',
      handler: contractUsRouter,
    },
    {
      path: '/blogs',
      handler: blogRouter,
    },
    {
      path: '/payment',
      handler: paymentRouter,
    }
   
  ];

  module.exports = routes;


