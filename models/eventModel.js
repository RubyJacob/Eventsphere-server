const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
     title:{
        type: String,
        required : true
    },
     organizer:{
        type: String,
        required : true
    },
     category:{
        type: String,
        required : true
    },
    date:{
        type: Date,
        required : true
    },
    description:{
        type: String,
        required : true
    },
    time:{
        type: String,
        required : true
    },
    duration:{
        type: Number,
        required : true
    },
    location:{
        type: String,
        required : true
    },
    agelimit:{
        type: String,
        required : true
    },
    price:{
        type: Number,
        required : true
    },
    eventImage:{
        type: String,
        required : true
    },
    isDeleted: {
    type: Boolean,
    default: false
    }
    
})

const events = mongoose.model("events",eventSchema)

module.exports = events