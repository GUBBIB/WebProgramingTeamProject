<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\AuthController;

// 게시판/게시글/댓글 관련 API
Route::get('/boards', [BoardController::class, 'board_List_Search']);
Route::get('/boards/postAll', [PostController::class, 'posts_All_List_Search']);
Route::get('/boards/{BRD_id}', [PostController::class, 'post_List_Search']);
Route::get('/boards/{BRD_id}/posts/{PST_id}', [PostController::class, 'posts_Details_Search']);
Route::get('/boards/{BRD_id}/posts/{PST_id}/comments', [CommentController::class, 'coments_List_Search']);

Route::post('/boards', [BoardController::class, 'store']);
Route::post('/posts', [PostController::class, 'store']);
Route::post('/comments', [CommentController::class, 'store']);
Route::post('/boards/{BRD_id}/posts/{PST_id}/view', [PostController::class, 'incrementViews']);

Route::post('/boards/search', [BoardController::class, 'board_Search_By_Keyword']);

// 로그인 관련 API
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// 회원정보 수정 API
Route::post('/profile/update', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');

// 게시글 수정
Route::put('/posts/{PST_id}', [PostController::class, 'update']);

// 게시글 삭제
Route::delete('/posts/{PST_id}', [PostController::class, 'destroy']);