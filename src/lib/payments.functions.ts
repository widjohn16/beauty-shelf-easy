import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
} from "@/lib/stripe.server";

type CartItemInput = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
};

type CustomerInput = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

type CheckoutResult =
  | { clientSecret: string; orderId: string }
  | { error: string };

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      items: CartItemInput[];
      customer: CustomerInput;
      returnUrl: string;
      environment: StripeEnv;
    }) => {
      if (!data.items?.length) throw new Error("Carrinho vazio");
      if (!data.customer?.email) throw new Error("Email obrigatório");
      return data;
    },
  )
  .handler(async ({ data }): Promise<CheckoutResult> => {
    try {
      const stripe = createStripeClient(data.environment);

      const total = data.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );

      // Create order in DB first
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );

      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_name: data.customer.name,
          customer_email: data.customer.email,
          customer_phone: data.customer.phone ?? null,
          shipping_address: data.customer.address ?? null,
          total,
          status: "pending",
        })
        .select()
        .single();

      if (orderErr || !order) {
        return { error: orderErr?.message ?? "Falha ao criar pedido" };
      }

      await supabase.from("order_items").insert(
        data.items.map((i) => ({
          order_id: order.id,
          product_id: i.id,
          product_name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
      );

      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded_page",
        mode: "payment",
        return_url: `${data.returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
        automatic_payment_methods: { enabled: true },
        customer_email: data.customer.email,
        line_items: data.items.map((i) => ({
          quantity: i.quantity,
          price_data: {
            currency: "brl",
            product_data: {
              name: i.name,
              ...(i.image_url ? { images: [i.image_url] } : {}),
            },
            unit_amount: Math.round(i.price * 100),
          },
        })),
        payment_intent_data: {
          description: `Pedido ${order.id}`,
          metadata: { order_id: order.id },
        },
        metadata: { order_id: order.id },
      });

      await supabase
        .from("orders")
        .update({ stripe_session_id: session.id })
        .eq("id", order.id);

      return {
        clientSecret: session.client_secret ?? "",
        orderId: order.id,
      };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
