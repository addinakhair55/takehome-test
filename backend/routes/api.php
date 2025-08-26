<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;

// AUTH
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/login', [AuthController::class, 'login']);

// PROTECTED ROUTES
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);

    Route::middleware('role:admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);   // create
        Route::put('/products/{id}', [ProductController::class, 'update']); // update
        Route::delete('/products/{id}', [ProductController::class, 'destroy']); // delete
    });
});

// TEST
Route::get('/test', fn() => response()->json(['message' => 'API is working']));
