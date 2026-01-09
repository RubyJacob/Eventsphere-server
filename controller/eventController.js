const events = require('../models/eventModel')

// add event details
exports.addEventController = async(req,res)=>{
    console.log("Inside addEventController");
    console.log(req.body);
    
    const {title, organizer, category, date, description, time, duration, location, agelimit, price, eventImage}= req.body
    //console.log(title, organizer, category, date, description, time, duration, location, agelimit, price, eventImage);
    //res.status(200).json("event add request received")
    try{
        const existingEvent = await events.findOne({title,organizer})
        if(existingEvent){
            res.status(401).json("Event Already Exists..")
        }
        else{
            const newEvent = await events.create({
                title, organizer, category, date, description, time, duration, location, agelimit, price, eventImage
            })
            res.status(200).json(newEvent)
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

//get home events - Landing page
exports.getHomeEventsController = async(req,res)=>{
    console.log("Inside getHomeEventsController");
    try{
        const homeEvents = await events.find({ isDeleted: false }).sort({_id:-1}).limit(3)
        res.status(200).json(homeEvents)
    }
    catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

//get all events - Events page
exports.getAllEventsController = async(req,res)=>{
    console.log("Inside getAllEventsController");
    try{
        const allEvents = await events.find({ isDeleted: false })
        res.status(200).json(allEvents)
    }
    catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}


//view an event - view page
exports.viewEventController = async(req,res)=>{
    console.log("Inside viewEventController");
    const {id} = req.params
    try{
        const eventDetails = await events.findById({_id:id})
        res.status(200).json(eventDetails)
    }
    catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

//delete an event - adminhome page
exports.deleteEventController = async(req,res)=>{
    console.log("Inside deleteEventController");
    const {id} = req.params
    try{
        const deletedEvent = await events.findByIdAndUpdate(
        id,
      { isDeleted: true },
      { new: true }
       );
        res.status(200).json(deletedEvent)
    }
    catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}