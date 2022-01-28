# Use Stripe.js to Query Product Data and Pre-Render with Next.js

**[📹 Video](https://egghead.io/lessons/next-js-use-stripe-js-to-query-product-data-and-pre-render-with-next-js)**

> **🔁 Sequin Simplifier:** Skip the annoying Stripe price to product query. Instead, follow Jon as he creates the products and prices in Stripe, but then use a simple Postgres view atop your Sequin Stripe tables to pull this data into your pricing page using supabase.

---

Each of our subscription options will be a product in Stripe. In this video, we create a /pricing page to display our new products. We use the Stripe package to fetch these options at build time and add some simple styling to make it look nice!

Annoyingly, the prices list is what we need to request for pricing information, but does not contain product information - such as name. This means we need to make an additional request for the product information for each price. Good thing we are only doing this once at build time, as the request time could add up pretty quickly, if we needed to do this on every request!

Lastly, we sort the list of plans from Stripe, to ensure that the prices go up in ascending order. Since each plan has a price, we can use a simple native JS sorting technique.

## 🔁 Query Supabase for Products and Price

Instead of building a nested Stripe API call to pull in prices and products, you can just query this data right from your Sequin Stripe tables. Use a Postgres view to make this simple.

### Create a `plans` view

First, map prices to products using a Postgres view. To do so, head to the Supabase console, and open the **SQL Editor**. Then, run the following statement:

```sql
create view public.plans as
select
  stripe.price.id,
  stripe.product.name,
  (stripe.price.unit_amount/100.00)::money,
  stripe.price.recurring_interval,
  stripe.price.currency
from stripe.price
left join stripe.product
  on stripe.price.product_id = stripe.product.id
order by stripe.price.unit_amount desc;
```

This query creates a new view in the public schema called `plans`. The underlying `select` statement joins the `price` table with the `product` table to retrieve all the data you need for the pricing page.

### Query the `plans` view on the pricing page

Now, pull the `plans` into the pricing page using supabase.

Instead of requiring the Stripe SDK, simply import your Supabase client:

```js
import { supabase } from "../utils/supabase";
```

Then skip the nested query completely and set your props as follows:

```js
export const getStaticProps = async () => {
  const { data: plans } = await supabase.from("plans").select("*");

  return {
    props: {
      plans,
    },
  };
};
```

Your `plans` view takes care of the join and sorting - making this a fast and efficient query.

[👉 Next lesson](/17-create-shared-nav-bar-in-next-js-with-_app-js)