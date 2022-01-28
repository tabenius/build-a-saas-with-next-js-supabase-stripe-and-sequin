# Subscribe the UI to Database Changes with Supabase Real-Time

## 🔁 Sequin Remix: Real-time + Real-time = 🧁

If you've made it this far, you are in for a treat. Because Sequin is syncing your Stripe data in real-time to your Supabase database, Supabase real-time will work perfectly. Here, you'll activate Supabase real-time for your `subscription` table - then take a seat and watch the customer's subscription immediately reflect the the state in Stripe.

## [📹 Jon's Video](https://egghead.io/lessons/supabase-subscribe-the-ui-to-database-changes-with-supabase-real-time) & Overview

The cancellation event from stripe doesn't get triggered until the end of the billing cycle. Therefore, our customer may still be using our app when their subscription status changes, with their dashboard confusingly displaying the incorrect data.

In this video, we implement Supabase real-time to subscribe the UI to changes in the database. We can initiate the subscription in our `useUser` hook, and specify that we only care about updates to our currently logged in user.

In order for Supabase to broadcast these changes on our websocket connection, we need to enable replication for the specific tables we want to subscribe to.

This means that anytime ~~our is_subscribed value changes in the profile table~~ a subscription changes, our `useUser` hook will automatically be updated with the new value, and the dashboard will immediately update to display the correct data.

## 🔁 Turn on replication for your `subscription` table

Open the Supabase dashboard and navigate to **Database → Replication** and click tables. Flip the switch to turn on real-time for your `subscription` table.

## 🔁 Subscribe to real-time subscription changes

Now, subscribe to updates to the subscription table for your user. In `user.js` add the following `useEffect`:

```js
useEffect(() => {
    if (user) {
      const subscription = supaStripe
        .from(`subscription:customer_id=eq.${user.stripe_customer_id}`)
        .on("*", (payload) => {
          console.log("Subscription Fired", payload);
          setUser((user) => ({
            ...user,
            subscription: [
              {
                stripe_subscription_status: payload.new.status,
                stripe_subscription_id: payload.new.id,
              },
            ],
          }));
        })
        .subscribe();

      console.log(subscription);

      return () => {
        supaStripe.removeSubscription(subscription);
      };
    }
  }, [user?.subscription]);
```

Walking through this code:

* As soon as a user is defined, you subscribe to any changes in the subscription table associated to the user.
* If a change occurs, you'll update the user's subscription details with the new details from the subscription payload.

Now, follow along with Jon as he manually cancels a Stripe subscription - you'll see the change is immediately presented to the user.

---

## [👉 Next lesson](/26-configure-stripe-for-production-and-deploy-next-js-application-with-vercel)