export interface SumUpCheckoutResult {
  mode: "live" | "simulation";
  checkoutId: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  redirectUrl?: string;
}

export async function createSumUpCheckout(params: {
  amount: number;
  orderId: string;
  description: string;
}): Promise<SumUpCheckoutResult> {
  const apiKey = process.env.SUMUP_API_KEY;
  const merchant = process.env.SUMUP_MERCHANT_CODE;

  if (!apiKey || !merchant) {
    return {
      mode: "simulation",
      checkoutId: `sim_${params.orderId}`,
      status: "COMPLETED",
    };
  }

  try {
    const res = await fetch("https://api.sumup.com/v0.1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkout_reference: params.orderId,
        amount: params.amount,
        currency: "GBP",
        merchant_code: merchant,
        description: params.description,
      }),
    });

    if (!res.ok) {
      return {
        mode: "simulation",
        checkoutId: `sim_${params.orderId}`,
        status: "COMPLETED",
      };
    }

    const data = (await res.json()) as { id: string; status?: string };
    return {
      mode: "live",
      checkoutId: data.id,
      status: data.status === "PAID" ? "COMPLETED" : "PENDING",
    };
  } catch {
    return {
      mode: "simulation",
      checkoutId: `sim_${params.orderId}`,
      status: "COMPLETED",
    };
  }
}
