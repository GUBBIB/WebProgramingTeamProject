<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Auth::routes();

Route::get('/', function () {
    return view('welcome');
});

//누구나 접근 가능
Route::post('/api/register', [AuthController::class, 'register']);
Route::post('/api/login', [AuthController::class, 'login']);

// 내부적으로 auth 라는 middleware 가 작성 돼 있고 
// 사용자만 접근 가능
Route::middleware(['auth'])->group(function () {
    Route::post('/api/logout', [AuthController::class, 'logout']);
    Route::get('/api/user', [AuthController::class, 'user']);
    Route::post('/api/profile', [AuthController::class, 'updateProfile']);
});
