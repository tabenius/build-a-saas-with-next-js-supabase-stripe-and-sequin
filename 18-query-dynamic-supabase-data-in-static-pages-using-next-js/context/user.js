import { createContext, useState, useEffect, useContext } from "react";
import { supabase, supaStripe } from "../utils/supabase";
import { useRouter } from "next/router";
import moment from "moment";
import axios from "axios";

const Context = createContext();

const Provider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(supabase.auth.user());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.post("/api/set-supabase-cookie", {
      event: user ? "SIGNED_IN" : "SIGNED_OUT",
      session: supabase.auth.session(),
    });
  }, [user]);

  useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user();

      if (sessionUser) {
        if (
          moment().isBetween(
            moment(sessionUser.created_at).subtract(2, "s"),
            moment(sessionUser.created_at).add(2, "s")
          )
        ) {
          console.log("This is a new user");
          await createStripeCustomer(sessionUser);
        } else console.log("This is an existing user");

        const { data: profile } = await supaStripe
          .from("customer")
          .select(
            `stripe_customer_id:id, subscription:subscription_customer_id_fk(stripe_subscription_id:id, stripe_subscription_status:status)`
          )
          .eq("metadata->>user_id", sessionUser.id)
          .order("created", {
            foreignTable: "subscription_customer_id_fk",
            ascending: false,
          })
          .limit(1, { foreignTable: "subscription_customer_id_fk" })
          .single();

        setUser({
          ...sessionUser,
          ...profile,
        });

        setIsLoading(false);
      }
    };

    getUserProfile();

    supabase.auth.onAuthStateChange(() => {
      getUserProfile();
    });
  }, []);

  const login = async () => {
    await supabase.auth.signIn({
      provider: "github",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const createStripeCustomer = async (user) => {
    try {
      await axios.post("/api/create-stripe-customer", {
        data: {
          record: {
            email: user.email,
            user_id: user.id,
          },
        },
      });
      console.log("Stripe customer created");
    } catch (err) {
      console.log(err);
    }
  };

  const exposed = {
    user,
    login,
    logout,
    isLoading,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);

export default Provider;
