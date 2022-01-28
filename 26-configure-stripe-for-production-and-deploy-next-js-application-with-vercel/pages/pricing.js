import { supabase } from "../utils/supabase";
import { useUser } from "../context/user";

const Pricing = ({ plans }) => {
  const { user, login, isLoading } = useUser();

  const showSubscribeButton =
    !!user && user.subscription[0].stripe_subscription_status !== "active";
  const showCreateAccountButton = !user;
  const showManageSubscriptionButton =
    !!user && user.subscription[0].stripe_subscription_status === "active";

  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {plans.map((plan) => (
        <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-4">
          <h2 className="text-xl">{plan.name}</h2>
          <p className="text-gray-500">
            ${plan.price / 100} / {plan.interval}
          </p>
          {!isLoading && (
            <div>
              {showSubscribeButton && <button>Subscribe</button>}
              {showCreateAccountButton && (
                <button onClick={login}>Create Account</button>
              )}
              {showManageSubscriptionButton && (
                <button>Manage Subscription</button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const getStaticProps = async () => {
  const { data: plans } = await supabase.from("plans").select("*");

  return {
    props: {
      plans,
    },
  };
};

export default Pricing;
