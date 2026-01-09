const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    email:{
        type: String,
        required : true
    },
    eventId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
      required: true,
    },
     eventtitle:{
      type: String,
       required: true,
     },
    ticketCount:{
        type: Number,
        required : true
    },
    ticketAmount:{
        type: Number,
        required : true
    },
   paymentStatus:{
        type: String,
        default : "pending"
    }
    },
    {
      timestamps: true   // Automatically adds createdAt & updatedAt
    }
   )

const bookings = mongoose.model("bookings",bookingSchema)

module.exports = bookings