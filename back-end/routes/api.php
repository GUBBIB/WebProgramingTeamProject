<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;

Route::get('/hello', function () {
    return response()->json(['message' => 'Hello from Laravel']);
});
 
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);


//게시글 상세 조회 api (BoardDetailController.php)
use App\Http\Controllers\Api\BoardDetailController;
Route::get('/boards/{id}', [BoardDetailController::class, 'show']);


//게시글 목록 조회 api (BoardListController.php)
use App\Http\Controllers\Api\BoardListController;
Route::get('/boards', [BoardListController::class, 'board_list']);


//댓글 조회 api (CommentController.php)
use App\Http\Controllers\Api\CommentController;
Route::get('/boards/{boardId}/comments', [CommentController::class, 'index']);
