import initStripe from "stripe";
import axios from "axios";

const handler = async (req, res) => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  let email = req.body.data.record.email;
  let user_id = req.body.data.record.user_id;

  const customer = await stripe.customers.create({
    email: email,
    metadata: {
      user_id: user_id,
    },
  });

  await wait();

  res.status(200).send({ message: `stripe customer created: ${customer.id}` });
};

const wait = () =>
  axios.get(
    "https://api.sequin.io/api/wait/b61349c9-9790-45f5-b6a1-199f88b8702b"
  );

export default handler;
