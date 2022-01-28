import { supabase } from "../utils/supabase";
import { useUser } from "../context/user";
import { useRouter } from "next/router";

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      {!isLoading && (
        <p className="mb-6">
          {user.subscription[0].stripe_subscription_status !== "active"
            ? `You are not subscribed!`
            : `Your subscription is ${user.subscription[0].stripe_subscription_status}`}
        </p>
      )}
    </div>
  );
};

export const getServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default Dashboard;
