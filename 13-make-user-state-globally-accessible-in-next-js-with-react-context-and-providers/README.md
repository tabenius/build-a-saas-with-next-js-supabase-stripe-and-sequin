# Make User State Globally Accessible in Next.js with React Context and Providers

**[📹 Video](https://egghead.io/lessons/next-js-make-user-state-globally-accessible-in-next-js-with-react-context-and-providers)**

> **🔁 Sequin Simplifier:** Follow Jon's steps to create a `useUser` hook. You'll then edit this hook to:
>   1. Check if the user is new or existing
>   2. If  the user is new, you'll call the `/create-stripe-customer` endpoint
>   3. Finally, you'll setup Supabase and the Supabase client to query your `stripe` schema to pull in the user's associated customer and subscription details.

---

Using React Context, we can create global variables that are available throughout our Next.js application. In this video, we create a useUser hook that exposes the state of our Supabase user to our tree of React components.

To get the state of our Supabase user when our application loads, we can use `supabase.auth.user()`. When the state of our user changes - e.g. our user logs in - Supabase will call the `supabase.auth.onAuthStateChange` callback. We can use this to update the state of our user object whenever the user signs in or out.

In order to consume our user context, we need to wrap our root component in our Context Provider. This can be done in the `pages/_app.js` file. Now any component in our tree of decedents can call `useUser` to get the state of our global singleton user.

Lastly, our user object only contains values from the `auth.users` table. In order to enrich our user with data from the profile table, we need to add a request to the `stripe` schema in our Supabase db within our user provider.

---

## 🔁 Check if the user is new

To simplify the logic of our app, we'll handle all the user logic in this hook (as opposed to splitting this out into Supabase functions). To do so, we need to determine if the user is new when they login. Here is how:

1. [Add `moment.js` to your repo](https://momentjs.com/docs/#/use-it/) and import it into the `user.js` file: `npm install moment`
2. You can determine if the user is new if the user's `created_at` timestamp is within 2 seconds of the current time. Luckily, the `created_at` timestamp is in the object returned by `supabase.auth.user()`. So you can apply this logic in the [user.js file](/13-make-user-state-globally-accessible-in-next-js-with-react-context-and-providers/context/user.js) using moment to easily compare the timestamps:

    ```js
    if (
        moment().isBetween(
        moment(sessionUser.created_at).subtract(2, "s"),
        moment(sessionUser.created_at).add(2, "s")
        )
    ) {
        console.log("This is a new user");
    } else console.log("This is an existing user");
    ```

## 🔁 If the user is new, call the `create-stripe-customer` endpoint

If the user is new, you'll want to call the `create-stripe-customer` endpoint to create the associated stripe customer. To do so:

1. Import axios into the user.js file: `import axios from "axios";`
2. Add a `createStripeCustomer` function that calls your `create-stripe-customer` endpoint:

   ```js
    const createStripeCustomer = async (user) => {
        try {
            await axios.post("/api/create-stripe-customer", {
            data: {
                record: {
                email: user.email,
                user_id: user.id,
                },
            },
            });
            console.log("Stripe customer created");
        } catch (err) {
            console.log(err);
        }
    };
   ```

3. Finally, call the `createStripeFunction()` if the user is indeed new:

    ```js
    if (sessionUser) {
        if (
          moment(sessionUser.last_sign_in_at).isBetween(
            sessionUser.created_at,
            moment(sessionUser.created_at).add(500, "ms")
          )
        ) {
          console.log("This is a new user");
          await createStripeCustomer(sessionUser);
        } else console.log("This is an existing user");
    ```

## 🔁 Query Stripe for your profile data

With Sequin in place and each user's `id` being stored as metadata on each associated Stripe customer, you can quickly query for your user's complete profile. Instead of creating and querying the `profile` table like Jon, you can just query the `stripe` tables in your database. To do so, you'll first ensure the `stripe` schema is available in the Supabase API, then initialize a new supabase client to access this schema, and then write your query:

### Add the `stripe` schema to the Supabase API

Out of the box, Supabase only exposes the `public` schema to the API. Follow these steps to also expose the `stripe` schema to the API:

1. In the supabase dashboard, navigate to **Settings → Project settings -> API**.
2. In the **Settings** area at the bottom, click the **Schema** input box and select the `stripe` schema.

### Initialize a new Supabase client that access the `stripe` schema

The supabase client's default configuration is set to query the `public` schema. And each client can only access one schema at a time. So you'll need to [initialize a new Supabase client](https://supabase.com/docs/reference/javascript/initializing#api-schemas) to access the `stripe` schema you just exposed.

To create a new Supabase client, open up the `utils/supabase.js` file and initialize a new client:

  ```js
  export const supaStripe = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY,
    {
      schema: "stripe",
    }
  );
  ```

Here, you are crating a new Supabase client called `supaStripe` that can access the `stripe` schema.

### Query for your user's stripe details

You'll want your `user` object to contain the associated `stripe_customer_id` and `stripe_subscription_id` / `stripe_subscription_status`. Instead of creating a profile table, you can query this data right from your `stripe` schema:

```js
const { data: profile } = await supaStripe
    .from("customer")
    .select(
    `stripe_customer_id:id, subscription:subscription_customer_id_fk(stripe_subscription_id:id, stripe_subscription_status:status)`
    )
    .eq("metadata->>user_id", sessionUser.id)
    .order("created", {
    foreignTable: "subscription_customer_id_fk",
    ascending: false,
    })
    .limit(1, { foreignTable: "subscription_customer_id_fk" })
    .single();
```

Breaking this query down:

1. You need to query across the `customer` and `subscription` tables in your `stripe` schema, so you need to import and `await` the `supaStripe` client.
2. You are selecting the `id` column from the `customer` table (aliasing the column to `stripe_customer_id` for clarity). Then, you are using the foreign key relationship on the `subscription` table to join and select the `stripe_subscription_id` and `stripe_subscription_status`.
3. You only need to retrieve the `customer` and `subscription` data for the current logged in user, so you add the `.eq` filter.
4. Finally, in the off change the current user has more than one subscription, you only want to return the one (i.e. `limit(1)`) most recent (i.e. `order()`) subscription.

This query pulls in all the remaining data you need to complete the user object. While you add a little complexity to the query, you don't need to spin up an additional `profile` table, map it to your user, and populate it with Stripe data.

However, now your exposing all your `stripe` data to the client. Proceed to lesson 14 to implement RLS.

[👉 Next lesson](/14-implement-authorization-using-row-level-security-and-policies)