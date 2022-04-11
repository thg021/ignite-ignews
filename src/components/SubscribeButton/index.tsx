import { useSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { api } from "../../service/api";
import { getStripeJs } from "../../service/stripe-js";
import styles from "./styles.module.scss";

interface SubscreibeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscreibeButtonProps) {
  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    if (session.activeSubscription) {
      router.push("/posts");
      return;
    }
    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }
  return (
    <button
      className={styles.subscribeButton}
      type="button"
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
