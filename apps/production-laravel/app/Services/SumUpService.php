<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SumUpService
{
    /** @return array{mode: string, checkoutId: string, status: string, redirectUrl?: string} */
    public function createCheckout(float $amount, string $orderId, string $description): array
    {
        $apiKey = env('SUMUP_API_KEY');
        $merchant = env('SUMUP_MERCHANT_CODE');

        if (! $apiKey || ! $merchant) {
            return [
                'mode' => 'simulation',
                'checkoutId' => 'sim_'.$orderId,
                'status' => 'COMPLETED',
            ];
        }

        try {
            $response = Http::withToken($apiKey)->post('https://api.sumup.com/v0.1/checkouts', [
                'checkout_reference' => $orderId,
                'amount' => $amount,
                'currency' => config('franzos.currency', 'GBP'),
                'merchant_code' => $merchant,
                'description' => $description,
            ]);

            if (! $response->successful()) {
                return [
                    'mode' => 'simulation',
                    'checkoutId' => 'sim_'.$orderId,
                    'status' => 'COMPLETED',
                ];
            }

            $data = $response->json();

            return [
                'mode' => 'live',
                'checkoutId' => $data['id'] ?? 'live_'.$orderId,
                'status' => ($data['status'] ?? '') === 'PAID' ? 'COMPLETED' : 'PENDING',
                'redirectUrl' => $data['hosted_checkout_url'] ?? null,
            ];
        } catch (\Throwable) {
            return [
                'mode' => 'simulation',
                'checkoutId' => 'sim_'.$orderId,
                'status' => 'COMPLETED',
            ];
        }
    }

    public function handleWebhook(array $payload): void
    {
        $reference = $payload['checkout_reference'] ?? $payload['order_id'] ?? null;
        if (! $reference) {
            return;
        }

        $status = match ($payload['status'] ?? 'PAID') {
            'PAID', 'SUCCESSFUL', 'COMPLETED' => 'COMPLETED',
            'FAILED' => 'FAILED',
            default => 'PENDING',
        };

        $order = \App\Models\Order::find($reference);
        if (! $order) {
            return;
        }

        $order->update(['payment_status' => $status]);
        $order->payment?->update([
            'status' => $status,
            'payload' => array_merge($order->payment->payload ?? [], ['webhook' => $payload]),
        ]);
    }
}
