import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

let _supabase: any = null;
function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}

async function updateOrderStatus(sessionId: string, status: string) {
  await getSupabase()
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("stripe_session_id", sessionId);
}

async function updateOrderByPaymentIntent(piId: string, status: string) {
  const stripe = (await import("@/lib/stripe.server")).createStripeClient(
    "sandbox",
  );
  // resolve session from PI via metadata.order_id if set
  const pi = await stripe.paymentIntents.retrieve(piId);
  const orderId = pi.metadata?.order_id;
  if (orderId) {
    await getSupabase()
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId);
  }
}

async function handle(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
  const obj = event.data.object;

  switch (event.type) {
    case "checkout.session.completed": {
      const status = obj.payment_status === "paid" ? "paid" : "processing";
      await updateOrderStatus(obj.id, status);
      break;
    }
    case "checkout.session.async_payment_succeeded":
      await updateOrderStatus(obj.id, "paid");
      break;
    case "checkout.session.async_payment_failed":
      await updateOrderStatus(obj.id, "failed");
      break;
    case "checkout.session.expired":
      await updateOrderStatus(obj.id, "cancelled");
      break;
    case "payment_intent.succeeded":
      await updateOrderByPaymentIntent(obj.id, "paid");
      break;
    case "payment_intent.payment_failed":
      await updateOrderByPaymentIntent(obj.id, "failed");
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handle(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
