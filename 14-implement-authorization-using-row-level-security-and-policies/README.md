# Implement Authorization Using Row Level Security and Policies

**[📹 Video](https://egghead.io/lessons/supabase-implement-authorization-using-row-level-security-and-policies)**

> **🔁 Sequin Simplifier:** Follow Jon's steps to add RLS to the `lessons` table. Then, when he adds RLS to his profile table, you'll instead follow the steps below to add RLS to your `stripe` tables.

---

Row level security is a feature of PostgreSQL, that secures our database by automatically denying all read and write requests. We can then create policies to enable particular actions for specific tables. This is similar to declaring an SQL where clause that is automatically appended to every query.

We use the Supabase dashboard to write a simple select policy. This allows anyone (signed in or not) to view rows from the lesson table.

Taking this concept a little further, we create a select policy for the profile table. This will allow any logged in user to select their specific profile.

Row level security is a powerful way to implement authorization, as it is enforced by the database itself, and runs for each row returned by a query. No need to go through an API to determine whether the user should have access or not. This can drastically improve the performance and reliability of our data fetching, as we can remove an unnecessary hop! 🎉

---

## 🔁 Manually add RLS to Stripe

The Supabase dashboard only allows you to add policies to tables in the `public` schema. To add RLS to your Stripe tables, you'll use the **SQL Editor** to manually run statements to apply RLS policies. Luckily, they are pretty simple:

### Add RLS to `stripe.customer`

To enable RLS on your `stripe.customer` table, run the following SQL statement:

```sql
alter table stripe.customer enable row level security;
```

### Create a policy

You only want logged in users to access their Stripe data, and no one elses. To do so, run the following SQL statement:

```sql
CREATE POLICY "secure stripe customer table"
ON stripe.customer
FOR SELECT using ( auth.uid() = (customer.metadata ->> 'user_id')::uuid);
```

The statement above creates a policy named `secure stripe customer table` and it only allows logged in users (`auth.uid()`) to `SELECT` data from the `customer` tables from rows associated to them (`= (customer.metadata ->> 'user_id')::uuid`).

Now that you have some RLS policies that are managed outside the Supabase dashboard, you can verify all existing policies by running: `select * from pg_policies;`.

### Secure the `subscription` table

Now, ensure that the `stripe.subscription` table is secure with an RLS policy. This will involve:

1. Creating a view, `subs_lock` that you can reference when creating an RLS policy. This view simply maps `user_id`s to the `stripe_subscription_ids` they are associated to. Here is the query:

   ```sql
   create view subs_lock as (
   SELECT (customer.metadata ->> 'user_id'::text)::uuid AS "user_id",
    subscription.id as "sub_id"
   FROM stripe.customer
     LEFT JOIN stripe.subscription ON customer.id = subscription.customer_id);
   ```

2. Revoking access to the `subs_lock` view for the `anon` and `public` database roles, so it can't be accessed by the public:

    ```sql
    revoke select on subs_lock from anon, public;
    ```

3. Enabling RLS on the `stripe.subscription` table:

    ```sql
    alter table stripe.subscription enable row level security;
    ```

4. Creating the proper policy to ensure that logged in users can only access their subscriptions by looking up which subscriptions are tied to the logged in user:

    ```sql
    CREATE POLICY "secure stripe subscription table"
    ON stripe.subscription
    FOR SELECT using (
        stripe.subscription.id in (
            select sub_id from subs_lock
            where auth.uid() = user_id
        )
    );
    ```

All your sensitive stripe data is now secure. Now, in the next lesson, you'll continue to extend the RLS policies.

[👉 Next lesson](/15-implement-gated-content-using-row-level-security-with-supabase)