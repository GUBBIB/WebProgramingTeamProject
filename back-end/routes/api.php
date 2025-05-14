<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\PostController;

Route::get('/hello', function () {
    return response()->json(['message' => 'Hello from Laravel']);
});

// 회원가입
Route::post('/register', [RegisterController::class, 'register']);
// 로그인
Route::post('/login', [LoginController::class, 'login']);
// 게시판 목록 조회
Route::get('/boards', [BoardController::class, 'board_list_search']);
// 게시글 생성
Route::post('/posts', [PostController::class, 'store']);