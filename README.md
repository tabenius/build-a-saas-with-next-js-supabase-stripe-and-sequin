# [REMIX: Build a SaaS product using Next.js, Supabase, Stripe, and ✨Sequin✨](https://egghead.io/courses/build-a-saas-product-with-next-js-supabase-and-stripe-61f2bc20)

<a href="https://www.youtube.com/watch?v=J-UStg7te6M">
  <img
    src="https://i.imgur.com/nTINNTf.png"
    alt="SEquin Remix - course artwork"
  />
</a>

> This repo accompanies and remixes this [free egghead course](https://egghead.io/courses/build-a-saas-product-with-next-js-supabase-and-stripe-61f2bc20).

## 🔍 About

For your frontend, this application will be using Next.js and Tailwind CSS. You will learn how to maneuver around an app and build a strong static pricing page.

For your backend AND authentication, we will make use of Supabase. Supabase is open source and is all of the backend services that you will need to build your site. It includes a dedicated and scalable Postgres database and user management with Row Level Security!

For payments, you will be using Stripe. It will be an individual payment checkout system that will create and update users' subscriptions.

Lastly, you'll sync all your Stripe data directly to your Supabase database using Sequin. Simplifying your architecture by allowing you to dirrectly query your database for Stripe data and skip all the webhooks.

Jon & Eric will take you through all of this and more in ~~just 1 hour and 10 minutes~~ 50 minutes!

## 🔁 Why Remix?

Sequin and Supabase fit together. More and more developers are starting to use Sequin to sync their API data into Supabase so they can build faster. Instead of setting up webhooks, wrangling the API params, and gluing together to keep data up to date - you can just use Supabase to query their Stripe data dirrectly.

Yes, we could have written a completely new tutorial. But Jon's tutorial is amazing. We thought we could build off the foundation set by Jon to show more developers how Sequin fits in. And because this is a fork, you can compare the approach of building with and without Sequin.

You'll find that with Sequin you don't need to build as much.

You don't need to create a profile table and the associated triggers and functions to populate it. With the Supabase user's table and Sequin's Stripe tables - you have everything you need.

You don't need to touch webhooks at all. No ngrok, switch statements, or issues with your data mismatching Stripe.

And you don't need to created nested Stripe API queries to pull in your products or prices. You can just use Supabase.

We're optimistic that as Supabase improves multi-schema support, this will only get easier and easier. Today, there are some manual RLS queries and permission grants we can easily imagine going away soon.

We're both betting on the power of Postgres - so let's see how far we can take this!

## 🎓 Instructors

This course was originally created by [Jon Meyers](https://jonmeyers.io). Jon is a Software Engineer, Educator and Hip Hop Producer from Melbourne, Australia. He's passionate about web development and enabling others to build amazing things!

[Jon's courses at egghead.](https://egghead.io/q/resources-by-jon-meyers)

Enjoyed the course? Follow Jon on [Twitter](https://twitter.com/jonmeyers_io) and subscribe to his [YouTube channel](https://youtube.com/c/JonMeyers).

The course is remixed by Eric Goldman. Co-founder of Sequin in California.

Learn more about how Sequin works by [creating an account](https://app.sequin.io/signup) and checking our their [docs](https://docs.sequin.io/welcome).

## 🗺 Table of Contents

> Remix Key:
>   ✅ : The lessons requires no alterations
>   🔁 : Remix. You'll see some changes here in the repo.
>   ~~Skipped all together~~

1. ✅ [Create a Supabase Project](/01-create-a-supabase-project)
2. ✅ [Create a Table in Supabase](/02-create-a-table-in-supabase)
3. ✅ [Create a Next.js App with Tailwind CSS](/03-create-a-next-js-app-with-tailwind-css)
4. ✅ [Query Data From Supabase Using Next.js](/04-query-data-from-supabase-using-next-js)
5. ✅ [Use Next.js to Query a Single Record From Supabase](/05-use-next-js-to-query-a-single-record-from-supabase)
6. ✅  [Implement Third Party Authentication with GitHub in Next.js Using Supabase](/06-implement-third-party-authentication-with-github-in-next-js-using-supabase)
7. ~~Add Relationships Between Tables in Supabase Using Foreign Keys~~
8. ~~Use Postgres Functions to Implement Database Logic with Supabase~~
9. ~~Use Supabase to Subscribe to Database Events with Postgres Triggers~~
10. 🔁 [Setup Sequin and Create a Stripe Customer with Next.js API Routes](/10-setup-sequin-and-create-a-stripe-customer-with-next-js-api-routes)
11. ~~Generate a Custom API Key to Secure an API Route in Next.js~~
12. ~~Automatically Create a Stripe Customer for Each User with Supabase Function Hooks~~
13. 🔁 [Make User State Globally Accessible in Next.js with React Context and Providers](/13-make-user-state-globally-accessible-in-next-js-with-react-context-and-providers)
14. 🔁 [Implement Authorization Using Row Level Security and Policies](/14-implement-authorization-using-row-level-security-and-policies)
15. 🔁 [Implement Gated Content Using Row Level Security with Supabase](/15-implement-gated-content-using-row-level-security-with-supabase)
16. 🔁 [Use Stripe.js to Query Product Data and Pre-Render with Next.js](/16-use-stripe-js-to-query-product-data-and-pre-render-with-next-js)
17. 🔁 [Create Shared Nav Bar in Next.js with \_app.js](/17-create-shared-nav-bar-in-next-js-with-_app-js)
18. 🔁 [Query Dynamic Supabase Data in Static Pages Using Next.js](/18-query-dynamic-supabase-data-in-static-pages-using-next-js)
19. 🔁 [Pass Supabase Session Cookie to API Route to Identify User](/19-pass-supabase-session-cookie-to-api-route-to-identify-user)
20. 🔁 [Charge Customer for Stripe Subscription in Next.js](/20-charge-customer-for-stripe-subscription-in-next-js)
21. ~~Subscribe to Stripe Webhooks Using Next.js API Routes~~
22. ~~Use the Supabase Service Key to Bypass Row Level Security~~
23. 🔁 [Create a Client Page that Requires Authentication in Next.js Using getServerSideProps](/23-create-a-client-page-that-requires-authentication-in-next-js-using-getserversideprops)
24. 🔁 [Allow Customer to Manage Their Subscription with Stripe Customer Portal](/24-allow-customer-to-manage-their-subscription-with-stripe-customer-portal)
25. 🔁 [Subscribe the UI to Database Changes with Supabase Real-Time](/25-subscribe-the-ui-to-database-changes-with-supabase-real-time)
26. ✅ [Configure Stripe for Production and Deploy Next.js Application with Vercel](/26-configure-stripe-for-production-and-deploy-next-js-application-with-vercel)
