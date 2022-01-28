# Implement Third Party Authentication with GitHub in Next.js Using Supabase

**[📹 Video](https://egghead.io/lessons/supabase-implement-third-party-authentication-with-github-in-next-js-using-supabase)**

> **✅ No changes:** Add GitHub authentication with `/login` and `/logout` pages just like Jon. Then, skip straight to [⏩ Lesson 10 ⏩](/10-create-a-stripe-customer-with-next-js-api-routes)

Supabase offers a number of authentication options out of the box. In this video, we look at implementing third party auth using GitHub as a provider.

In order to do this, we need to register a new OAuth application in GitHub, and configure it to communicate with our Supabase project. Supabase automatically handles receiving tokens at the /auth/v1/callback endpoint.

Additionally, we implement /login and /logout pages to handle authentication in our Next.js application. We can use the supabase-js library to detect whether or not a user is signed in using the supabase.auth.user() function.

[👉 Next lesson](/10-create-a-stripe-customer-with-next-js-api-routes)