# Pass Supabase Session Cookie to API Route to Identify User

**[📹 Video](https://egghead.io/lessons/supabase-pass-supabase-session-cookie-to-api-route-to-identify-user)**

> **🔁 Sequin Simplifier:** You'll follow Jon as he enhances the `useUser` hook to set a session cookie. Then, you'll begin to create the endpoint to `processSubscription`. You'll make a very small edit to the endpoint so that you retrieve the `stripe_customer_id` from your Sequin Stripe tables - but since you have RLS enabled - and this request is coming from the server - we need to jump ahead an implement a supabase client with the Supabase Service Key.

---

Supabase does not automatically set an auth cookie for our signed-in user. If we want to know who our user is on the server, we need to call `supabase.auth.api.setAuthCookie`.

We will create an API route to set a Supabase auth cookie. Additionally, we modify our useUser hook to call this endpoint anytime the state of our user changes. In order to make our HTTP requests slightly more readable, we install the axios library.

Now that we have a cookie being automatically sent with every request, we can use the getUserByCookie function to get the requesting user. If our API route requires a signed-in user, we can immediately send a 401 response if a user is not present.

We need to know our user's stripe_customer to initiate a checkout session with Stripe (next lesson), so need to enrich this user data with their profile.

While our request from the client to the API route contains our auth cookie, it is not automatically attached to server-side calls using our Supabase client.

---

## 🔁 Retrieve `stripe_customer_id` from Stripe tables

Instead of retrieving the `stripe_customer_id` from a profile table, you can pull this right from your Stripe tables. Edit the Supabase query in the `[priceId].js` file as follows:

```js
const {
data: { stripe_customer_id },
} = await supabase
.from("customer")
.select("stripe_customer_id:id")
.eq("metadata->>user_id", user.id)
.single();
```

## 🔁 Initialize Supabase Client with service key

You'll see that when you run this query, and error returns because the supabase client is denied access to the `customer` table by our RLS policy. This is a little puzzling - but since this call is coming from the server, we can bypass RLS with the Supabase Service Key.

In the Supabase dashboard, navigate to **Settings -> API** and copy your service key.

In your, `.env.local` file, create a new variable `SUPABASE_SERVICE_KEY` and paste in the service key you just retrieved.

Finally, head to `/utils/supabase.js` and define a new client called `supaSecret` that uses the service key:

```js
export const supaSecret = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      schema: "stripe",
    }
  );
```

You now have a client that can bypass RLS and access your `stripe` schema. Now, use this client in the `[priceId].js` route:

```js
import { supaSecret } from "../../../utils/supabase";
import cookie from "cookie";

const handler = async (req, res) => {
  const supabase = supaSecret();

  ...
```

[👉 Next lesson](/20-charge-customer-for-stripe-subscription-in-next-js)