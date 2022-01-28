import { supaSecret } from "../../../utils/supabase";
import cookie from "cookie";

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

  res.send({
    ...user,
    stripe_customer_id,
  });
};

export default handler;
