const charges = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_API_KEY_SECRET);

charges.post('/checkout-session', async (req, res) => {
  const { amount: unit_amount } = req.body;

  if (!unit_amount) {
    return res.status(400).send('amount is required');
  }

  let stripeSession;
  try {
    stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation',
              description: 'One-time donation to Web Captioner',
            },
            unit_amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      submit_type: 'donate',
      success_url: `${process.env.HOST_PUBLIC}/donate/thank-you`,
      cancel_url: `${process.env.HOST_PUBLIC}/donate`,
    });
  } catch (e) {
    console.error('Payment error', e);
    return res.sendStatus(400);
  }

  res.json({ id: stripeSession.id });
});

module.exports = charges;
