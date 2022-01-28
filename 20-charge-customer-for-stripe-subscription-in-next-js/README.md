# Charge Customer for Stripe Subscription in Next.js

**[📹 Video](https://egghead.io/lessons/next-js-charge-customer-for-stripe-subscription-in-next-js)**

> **🔁 Sequin Simplifier:** No major changes - follow Jon as he completes the endpoint. Just ensure that when referencing the Stripe customer_id you use the correct variable: `stripe_customer_id` :) Then, skip all the webhooks and jump ahead to [⏩ Lesson 23 ⏩](/23-create-a-client-page-that-requires-authentication-in-next-js-using-getserversideprops)

---

Stripe makes taking payments easy. We can use the Stripe library to create a checkout session. This takes a configuration object, which describes how we want to charge our customer, the method we would like to use, and where we want to redirect the user based on a successful transaction or cancellation.

In this video, we create a new API route to initiate a Stripe session to charge for a particular subscription option. This API route returns the session's ID, which we can use to redirect the client. In order to do this, we install the stripe-js library - which is used client-side to interact with Stripe - and initialize it using our publishable key.

Lastly, we can use the test credit card for Stripe to confirm everything is working in test mode.

---

[👉 Next lesson](/23-create-a-client-page-that-requires-authentication-in-next-js-using-getserversideprops)