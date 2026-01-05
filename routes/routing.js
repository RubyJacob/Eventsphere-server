const express = require('express')
const userController = require('../controller/userController')
const eventController = require('../controller/eventController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')


const router = new express.Router()

//register
router.post('/register',userController.registerController)

//login
router.post('/login',userController.loginController)

//----------------- user----------------

//get home events
router.get('/home-events',eventController.getHomeEventsController)

//get all events
router.get('/all-events',eventController.getAllEventsController)

//get eventDetails 
router.get('/events/:id/view',jwtMiddleware,eventController.viewEventController)

//get eventDetails for registering  
router.get('/events/:id/register',jwtMiddleware,eventController.viewEventController)







//----------------- admin----------------

//add book 
router.post('/event-add',adminMiddleware,eventController.addEventController)



module.exports = router