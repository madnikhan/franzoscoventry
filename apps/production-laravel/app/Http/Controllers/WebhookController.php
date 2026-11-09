<?php

namespace App\Http\Controllers;

use App\Services\SumUpService;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function __construct(private SumUpService $sumUp) {}

    public function sumup(Request $request)
    {
        $this->sumUp->handleWebhook($request->all());

        return response()->json(['ok' => true]);
    }
}
