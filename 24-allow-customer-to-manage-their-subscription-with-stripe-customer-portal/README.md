# Allow Customer to Manage Their Subscription with Stripe Customer Portal

**[📹 Video](https://egghead.io/lessons/next-js-allow-customer-to-manage-their-subscription-with-stripe-customer-portal)**

> **🔁 Sequin Simplifier:** Configure your Stripe Customer Portal just like Jon. Then add the button to open the portal by calling the `portal.js` API endpoint. Again, you'll slightly alter the supabase query for this endpoint to use your Sequin Stripe tables. And then skip all the webhooks.

---

We can use Stripe's Customer Portal to allow our users to manage their subscription and payment information. We will configure the Customer Portal in the Stripe Dashboard and create the required pages for /terms and /privacy.

Additionally, we create an API route to initiate our customer portal session. Similarly to our API route that charges for a subscription, we need to get the token from the cookie, add it to the Supabase session and fetch the associated profile data.

Since the updated event gets triggered for creating a new subscription, as well as updating an existing one, and we want to perform the same changes in our Supabase DB, we can replace our case statement to handle customer.subscription.updated.

Lastly, we implement a case for deleted, setting is_subscribed to false and interval to null. Since this event doesn't actually trigger until the end of the customer's billing cycle, we can manually cancel the user's subscription from the Stripe dashboard.

---

## 🔁 Use your Stripe tables in the `/portal` endpoint

You'll use the same process to generate a Stripe Customer Portal session as you did to generate Stripe checkout session. And again, you'll query for the `stripe_customer_id` from your stripe tables.

So in the [`portal.js` file](/24-allow-customer-to-manage-their-subscription-with-stripe-customer-portal/pages/api/portal.js) you'll see the following small alterations:

1. You'll use the `supaSecret` supabase client.
2. You'll query for the `stripe_customer_id` using the supaSecret client.
3. You'll then pass that `stripe_customer_id` into the function that generations the session for the customer portal:

```js
const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer_id,
    return_url: "http://localhost:3000/dashboard",
  });
```

[👉 Next lesson](/25-subscribe-the-ui-to-database-changes-with-supabase-real-time)