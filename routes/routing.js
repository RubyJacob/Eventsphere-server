const express = require('express')
const userController = require('../controller/userController')
const eventController = require('../controller/eventController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const bookingController = require('../controller/bookingController')


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

// make sessions in this - register component
router.post('/events/register-event',jwtMiddleware,bookingController.registerEventDetailsController)

//get each user registered events 
router.get('/user-registered-events',jwtMiddleware,bookingController.getUserWiseRegistrationsController);

//get all events - admin
router.get('/all-admin-events',adminMiddleware,eventController.getAllEventsController)

// events - admin
router.post('/save-details',jwtMiddleware,bookingController.saveBookingAfterPaymentController)

//delete an  event - admin
router.delete('/event/:id/delete',adminMiddleware,eventController.deleteEventController)











//----------------- admin----------------

//add book 
router.post('/event-add',adminMiddleware,eventController.addEventController)

//get each event details
router.get('/grouped-users',adminMiddleware,bookingController.getRegisteredUsersGroupedByEvent);



module.exports = router