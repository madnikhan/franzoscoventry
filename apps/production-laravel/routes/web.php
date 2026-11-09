<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\TillController;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/menu', [MenuController::class, 'index'])->name('menu');
Route::post('/menu/cart', [MenuController::class, 'addToCart'])->name('menu.cart');

Route::get('/order', [OrderController::class, 'checkout'])->name('order.checkout');
Route::post('/order', [OrderController::class, 'store'])->name('order.store');
Route::post('/order/cart', [OrderController::class, 'updateCart'])->name('order.cart');

Route::get('/track', [TrackController::class, 'index'])->name('track.index');
Route::post('/track', [TrackController::class, 'lookup'])->name('track.lookup');
Route::get('/track/{orderNumber}', [TrackController::class, 'show'])->name('track.show');

Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/opening-hours', [PageController::class, 'openingHours'])->name('opening-hours');

Route::get('/kitchen', [KitchenController::class, 'index'])->name('kitchen');
Route::post('/kitchen/orders/{id}/status', [KitchenController::class, 'updateStatus'])->name('kitchen.status');

Route::get('/driver', fn () => redirect()->route('driver.board'));
Route::get('/driver/login', [DriverController::class, 'loginForm'])->name('driver.login');
Route::post('/driver/login', [DriverController::class, 'login'])->name('driver.login.post');
Route::get('/driver/board', [DriverController::class, 'board'])->name('driver.board');
Route::post('/driver/orders/{id}/assign', [DriverController::class, 'assign'])->name('driver.assign');

Route::get('/till', [TillController::class, 'index'])->name('till');
Route::post('/till', [TillController::class, 'store'])->name('till.store');

Route::get('/admin', [AdminController::class, 'index'])->name('admin');

Route::post('/webhooks/sumup', [WebhookController::class, 'sumup'])->name('webhooks.sumup');
