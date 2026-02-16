import { NextRequest, NextResponse } from "next/server";
import { initializePayment } from "@/lib/moneroo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, phone } = body;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

    const paymentResponse = await initializePayment({
      amount: 15000,
      currency: "XOF",
      description: "Abonnement PLR Library - 1 mois",
      customer: {
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
      },
      return_url: `${siteUrl}/payment/callback`,
      metadata: {
        user_email: email,
        subscription_type: "monthly",
      },
      methods: ["mtn_bj", "moov_bj", "wave_ci", "orange_ci"],
    });

    return NextResponse.json({
      checkoutUrl: paymentResponse.data.checkout_url,
      paymentId: paymentResponse.data.id,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 },
    );
  }
}
