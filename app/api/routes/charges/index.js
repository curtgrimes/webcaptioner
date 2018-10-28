const charges = require('express').Router();
const stripe = require("stripe")(process.env.STRIPE_API_KEY_SECRET);

charges.post('/', async (req, res, next) => {
    const {amount, email, token} = req.body;

    if (!amount || !email || !token) {
        res.sendStatus(400);
        return;
    }

    stripe.customers.create({
        email,
        source: token,
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: "One-time donation to Web Captioner",
        currency: "usd",
        customer: customer.id,
        receipt_email: email,
      }))
    .then(charge => {
        // res.send(JSON.stringify({receiptEmail: charge.receipt_email}));
        res.sendStatus(200);
        return;
    })
    .catch((e) => {
        res.status(400).json({
            message: e.type && e.type === 'StripeInvalidRequestError' ? e.message : 'Something went wrong.'
        });
    });
});

module.exports = charges;