# Setup Sequin and Create a Stripe Customer with Next.js API Routes

## 🔁 Sequin Remix: Setup Sequin, Skip the Profile Table

Instead of creating a new profile table and Supabase function to associate Stripe customers to your Supabase users, we'll just use a Sequin sync. At this step, follow Jon to setup a Stripe account, retrieve your stripe credentials, and define the `create-stripe-customer` endpoint using the Stripe SDK - and then follow the steps below to setup Sequin and enhance your `create-stripe-customer` endpoint. Then, skip straight to [⏩ Lesson 13 ⏩](/13-make-user-state-globally-accessible-in-next-js-with-react-context-and-providers)

## [📹 Jon's Video](https://egghead.io/lessons/supabase-create-a-stripe-customer-with-next-js-api-routes) & Overview

Every transaction in Stripe is associated with a customer. Since we want our user to be able to see their transaction history in Stripe, we need to keep a track of their customer ID.

In this video, we create a new Stripe account and configure our Next.js application to use its publishable and secret API keys. Additionally, we discuss by adding NEXT *PUBLIC* to our environment variable names, it exposes them to the client - running in the user's browser. This is entirely safe for our publishable key - which can be public - but not our secret key - which should always be kept private.

To create a Stripe customer, we need to use our private API key, meaning this logic will need to be executed on the server. Next.js makes this simple with API routes - special serverless functions that will be created for any `.js` files in the `pages/api` directory.

We create a new API route to handle adding a stripe customer.

---

## 🔁 Setup Sequin

With your Stripe account in place, you can now setup your Sequin account and sync:

1. [Create a Sequin Account](https://app.sequin.io/signup) and select to create a new Stripe sync.
2. In the **Add key** section, select **+ Add new API key**. Turn off the **Stripe Connect** toggle so you can easily just paste in the Stripe secret key your retrieved earlier. Then click **Save**.
3. In the **Select tables** section, turn off the **Sync all tables** toggle and select to just sync the following four tables:

   - Core
     - Customer
     - Product
   - Billing
     - Price
     - Subscription

4. Finally, in the **Destination** section you'll want to sync your data straight to your Supabase database. To do so, click **Edit** and select **Launch or Connect**. Click **Connect** and enter the connection details for your Supabase database (which you can find under **Settings → Database → Connection info**). Under **Schema to sync to** enter `stripe` - then click **Setup**.
5. You'll be asked which database users should be granted access to your synced data. You can select all the users for now.
6. Click **Start syncing**. Sequin will now create a new `stripe` schema in your Supabase postgres database and begin syncing all the data from your Stripe account.
7. Now, return to the Supabase client, and in the **Table Editor** section, you'll now see `stripe` as an available schema.
8. As a last step, you need to update some permission grants to ensure all of the Supabase database users can read your synced data. First, get your `Sequin Read` role by going to **Database → Roles**. You'll see a role `sequin_read_▒▒▒▒` that is unique to your database. Copy this role name.
9. Then, run the following commands in the Supabase **SQL Editor**:

```sql
GRANT sequin_read_▒▒▒▒ TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA stripe TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA stripe TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres, supabase_admin IN SCHEMA stripe GRANT ALL ON TABLES TO anon, authenticated, service_role;
```

Sequin is now syncing all your Stripe data directly to your Supabase Postgres database in realtime. Within 500ms, any change on Stripe will be reflected in Supabase.

## 🔁 Enhance the `create-stripe-customer` endpoint

To map Stripe customers to their corresponding Supabase user, we'll enhance the `create-stripe-customer` endpoint in two ways:

### Store `user_id` in Stripe metadata

When you create the Stripe customer, store the Supabase `user_id` as metadata:

```js
// pages/api/create-stripe-customer.js
...

  const customer = await stripe.customers.create({
    email: email,
    metadata: {
      user_id: user_id,
    },
  });

...
```

### Implement the Sequin `/wait` endpoint

You only want to return a `200 OK` from the `create-stripe-customer` endpoint when you know the customer has been created by Stripe and is now synced to the `stripe` schema in your database. Use Sequins `/wait` endpoint to do this:

1. Add `axios` to your project (`npm install axios`) and initialize it (Jon likes axios and uses it later in the project, so best to use it here too)
2. Get your sync's specific wait endpoint by going to the Sequin console, clicking the **Connect** button on your sync, and clicking the **Wait Endpoint** tab.
3. Add a `wait` function that calls the endpoint your just retrieved:

    ```js
    const wait = () =>
    axios.get(
        "https://api.sequin.io/api/wait/▒▒▒▒▒▒▒▒▒-▒▒▒▒▒▒▒▒▒-▒▒▒▒▒▒▒▒▒-▒▒▒▒▒▒▒▒▒"
    );
    ```

4. Finally, `await` the `wait` function before returning a `200 OK`. See the final `/create-stripe-customer` endpoint in the repo [here](/10-create-a-stripe-customer-with-next-js-api-routes/pages/api/create-stripe-customer.js).

You can then call this endpoint using the Thunder Client (just like Jon!) - but in this case you'll now see the customer is created in Stripe and immediately synced to the `stripe.customer` table in your Supabase database.

---

## [👉 Next lesson ⏩](/13-make-user-state-globally-accessible-in-next-js-with-react-context-and-providers)