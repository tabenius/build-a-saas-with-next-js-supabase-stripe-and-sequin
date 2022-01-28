# Implement Gated Content Using Row Level Security with Supabase

**[📹 Video](https://egghead.io/lessons/supabase-implement-gated-content-using-row-level-security-with-supabase)**

> **🔁 Sequin Simplifier:** Follow Jon's steps to create a `premium_content` table, add some premium content, and enable RLS. Then, when you implement the RLS policy, use the SQL query below to verify that the logged in user is subscribed using your Sequin Stripe tables. Finally, replicate Jon's steps to implement `react-player` and show off your premium content!

---

We're using Row Level Security (RLS) to enforce authorization rules for each row in the database. This applies to the entire row, not specific columns. Therefore, if we want to create some premium content that is only available to our subscribed users, we need to create another table. Again, we can reference the lesson table's ID, using a foreign key relationship.

We will create a premium_content table that will store the video_url column for each lesson. We will fetch this data on the lesson details page, and write an RLS policy that will only enable read access for subscribed users.

This will ensure that our logged-in user has an active subscription, in order to view the video for our lesson. If the user is not signed in or has not paid for a subscription, they will only see the content from the lesson table.

Lastly, we want to display our video (hosted on YouTube) in an inline video player. For this, we can use the react-player package, and set some simple styling defaults that look great!

---

## 🔁 Add RLS to the `premium_content` table

With Sequin syncing your Stripe data right into your Supabase database, you didn't need to create a `profile` table. So when you implement RLS on the your `premium_content` table, you'll need to use query that pulls the data from your `stripe` tables.

To do so, follow Jon's steps to add RLS to the `premium_content` table - but when you create the `subscribed users can select premium content` policy, use the query below:

```sql
exists (
    select
        1
    from stripe.customer
    left join stripe.subscription on customer.id = subscription.customer_id
    where (customer.metadata ->> 'user_id'::text)::uuid = auth.uid ()
        AND(subscription.status = 'active'::text))
```

This query will resolve to `true` if the logged in user has an `active` subscription - allowing the user to see their premium content.

[👉 Next lesson](/16-use-stripe-js-to-query-product-data-and-pre-render-with-next-js)


