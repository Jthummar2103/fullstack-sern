var express = require('express');
var router = express.Router();

// import routes
const resourceRoutes = require('./resources');
const userRoutes = require('./users');
const categoryRoutes = require('./categories');
const authRoutes = require('./auth');

// use routes
router.use('/resources', resourceRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/auth', authRoutes);

module.exports = router;