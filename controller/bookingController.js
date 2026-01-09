const bookings = require('../models/bookingModel');
const stripe = require('stripe')(process.env.STRIPESECRET);


exports.registerEventDetailsController = async (req, res) => {
  console.log("Inside registerEventDetailsController");

  try {
    const {email, eventId, eventtitle, ticketCount, ticketAmount } = req.body;

   const line_items = [
  {
    price_data: {
      currency: "usd",
      product_data: {
        name: `Event - ${eventtitle}`,
         description:`TicketCount : ${ticketCount}`,
      },
      unit_amount: Math.round(ticketAmount),
    },
    quantity: Number(ticketCount),
  },
];


    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      payment_method_types: ["card"],
      success_url: `http://localhost:5173/user/payment-success?email=${email}&eventId=${eventId}&eventtitle=${eventtitle}&ticketCount=${ticketCount}&ticketAmount=${ticketAmount}`,
      cancel_url: 'http://localhost:5173/user/payment-error',
    });

    res.status(200).json({ url: session.url });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.saveBookingAfterPaymentController = async (req, res) => {
  console.log("Inside saveBookingAfterPaymentController");
  
  try {
    const { email, eventId, eventtitle, ticketCount, ticketAmount } = req.body;

    const booking = await bookings.create({
      email,
      eventId,
      eventtitle,
      ticketCount,
      ticketAmount,
      paymentStatus: "paid",
      ticketId: `TICKET-${Date.now()}`
    });

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json(err);
  }
};



exports.getRegisteredUsersGroupedByEvent = async (req, res) => {
   console.log("Inside getRegisteredUsersGroupedByEvent ");
  try {
    const result = await bookings.aggregate([
      //  Join events collection
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },

      // Join users collection USING EMAIL
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "user"
        }
      },
      { $unwind: "$user" },

      //  Group by event
      {
        $group: {
          _id: "$event._id",
          eventTitle: { $first: "$event.title" },

          users: {
            $push: {
              username: "$user.username",
              email: "$email",
              ticketCount: "$ticketCount",
              ticketAmount: "$ticketAmount",
              bookingDate: "$createdAt",
              paymentStatus:"$paymentStatus",
            }
          },
          totalRegistrations: { $sum: 1 },
          totalTickets: { $sum: "$ticketCount" }
        }
      },

      // 4️⃣ Sort events by date
      {
        $sort: { eventDate: 1 }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}


exports.getUserWiseRegistrationsController = async (req, res) => {
  
  console.log("Inside getUserWiseRegistrationsController");
  
  try {
    const email = req.payload.usermail; // or req.payload.email if renamed
    //console.log(email);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await bookings.aggregate([
      // 1️⃣ Match logged-in user
      {
        $match: { email }
      },
      // 1️⃣ Join USERS
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "user"
        }
      },
      { $unwind: "$user" },

      // 2️⃣ Join events
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },

     
      // 3️⃣ Group correctly
      {
        $group: {
        _id: "$user._id",   // ✅ MongoDB field reference
        email: { $first: "$email" },
        username: { $first: "$user.username" },
        createdAt: { $first: "$user.createdAt" },
        upcomingCount: {
            $sum: {
              $cond: [{ $gte: ["$event.date", today] }, 1, 0]
            }
          },
        completedCount: {
            $sum: {
              $cond: [{ $lt: ["$event.date", today] }, 1, 0]
            }
          },

          events: {
            $push: {
              eventId: "$event._id",
              title: "$event.title",
              date: "$event.date",
              location: "$event.location",
              category: "$event.category",
              bookingDate: "$createdAt"
            }
          },

          totalEvents: { $sum: 1 },
          totalTickets: { $sum: "$ticketCount" }
        }
      }
    ]);

    res.status(200).json(result[0] || {upcomingCount: 0, completedCount: 0});
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
