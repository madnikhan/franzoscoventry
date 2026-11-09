<?php

namespace App\Services;

use Illuminate\Support\Facades\Session;

class CartService
{
    private const SESSION_KEY = 'franzos.cart';

    /** @return list<array{itemId: string, name: string, unitPrice: float, quantity: int, customizations: array<string, string>}> */
    public function lines(): array
    {
        return Session::get(self::SESSION_KEY, []);
    }

    public function count(): int
    {
        return array_sum(array_column($this->lines(), 'quantity'));
    }

    public function subtotal(): float
    {
        return array_reduce($this->lines(), fn (float $sum, array $line) => $sum + ($line['unitPrice'] * $line['quantity']), 0.0);
    }

    public function add(string $itemId, string $name, float $unitPrice, int $quantity = 1, array $customizations = []): void
    {
        $lines = $this->lines();
        foreach ($lines as &$line) {
            if ($line['itemId'] === $itemId && $line['customizations'] == $customizations) {
                $line['quantity'] += $quantity;
                Session::put(self::SESSION_KEY, $lines);

                return;
            }
        }
        unset($line);

        $lines[] = [
            'itemId' => $itemId,
            'name' => $name,
            'unitPrice' => $unitPrice,
            'quantity' => $quantity,
            'customizations' => $customizations,
        ];
        Session::put(self::SESSION_KEY, $lines);
    }

    public function updateQuantity(string $itemId, int $quantity, array $customizations = []): void
    {
        $lines = $this->lines();
        foreach ($lines as $i => $line) {
            if ($line['itemId'] === $itemId && $line['customizations'] == $customizations) {
                if ($quantity <= 0) {
                    unset($lines[$i]);
                } else {
                    $lines[$i]['quantity'] = $quantity;
                }
                Session::put(self::SESSION_KEY, array_values($lines));

                return;
            }
        }
    }

    public function remove(string $itemId, array $customizations = []): void
    {
        $this->updateQuantity($itemId, 0, $customizations);
    }

    public function clear(): void
    {
        Session::forget(self::SESSION_KEY);
    }
}
