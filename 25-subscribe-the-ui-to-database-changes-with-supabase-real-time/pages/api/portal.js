import { supaSecret } from "../../utils/supabase";
import cookie from "cookie";
import initStripe from "stripe";

const handler = async (req, res) => {
  const supabase = supaSecret();
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  const token = cookie.parse(req.headers.cookie)["sb:token"];

  supabase.auth.session = () => ({
    access_token: token,
  });

  const {
    data: { stripe_customer_id },
  } = await supabase
    .from("customer")
    .select("stripe_customer_id:id")
    .eq("metadata->>user_id", user.id)
    .single();

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer_id,
    return_url: "http://localhost:3000/dashboard",
  });

  res.send({
    url: session.url,
  });
};

export default handler;
