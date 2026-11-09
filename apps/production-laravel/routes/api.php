<?php

use App\Http\Controllers\Api\DriverApiController;
use App\Http\Controllers\Api\KitchenApiController;
use App\Http\Controllers\Api\OrderApiController;
use Illuminate\Support\Facades\Route;

Route::get('/kitchen/orders', [KitchenApiController::class, 'orders']);
Route::get('/driver/deliveries', [DriverApiController::class, 'deliveries']);
Route::post('/driver/login', [DriverApiController::class, 'login']);

Route::get('/orders', [OrderApiController::class, 'index']);
Route::get('/orders/track/{orderNumber}', [OrderApiController::class, 'track']);
Route::post('/orders/{id}/status', [OrderApiController::class, 'updateStatus']);
Route::get('/admin/stats', [OrderApiController::class, 'stats']);
