import { createHmac } from "node:crypto";

const MONEROO_API_URL = "https://api.moneroo.io/v1";

interface MonerooCustomer {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface InitializePaymentParams {
  amount: number;
  currency: string;
  description: string;
  customer: MonerooCustomer;
  return_url: string;
  metadata?: Record<string, string>;
  methods?: string[];
}

interface MonerooPaymentResponse {
  message: string;
  data: {
    id: string;
    checkout_url: string;
  };
}

interface MonerooVerifyResponse {
  message: string;
  data: {
    id: string;
    status: "initiated" | "pending" | "success" | "failed" | "cancelled";
    amount: number;
    currency: { code: string };
    customer: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
    };
    metadata?: Record<string, string>;
  };
}

export async function initializePayment(
  params: InitializePaymentParams,
): Promise<MonerooPaymentResponse> {
  const response = await fetch(`${MONEROO_API_URL}/payments/initialize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MONEROO_SECRET_KEY}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...params,
      // Méthodes Mobile Money Bénin par défaut
      methods: params.methods || ["mtn_bj", "moov_bj"],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Moneroo error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

export async function verifyPayment(
  paymentId: string,
): Promise<MonerooVerifyResponse> {
  const response = await fetch(
    `${MONEROO_API_URL}/payments/${paymentId}/verify`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.MONEROO_SECRET_KEY}`,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Moneroo verify error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const computedSignature = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return computedSignature === signature;
}
