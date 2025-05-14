<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\CommentController;

Route::get('/hello', function () {
    return response()->json(['message' => 'Hello from Laravel']);
});

// 회원가입
Route::post('/register', [RegisterController::class, 'register']);

// 로그인
Route::post('/login', [LoginController::class, 'login']);

// 게시판 목록 조회
Route::get('/boards', [BoardController::class, 'board_List_Search']);

//게시글 목록 조회
// 호출할때 /api/boards/{BRD_id}?page=1 2 3 이런식으로 호출해야함
Route::get('/boards/{BRD_id}', [PostController::class, 'post_List_Search']);

// 게시글 상세 조회
Route::get('/boards/{BRD_id}/posts/{PST_id}', [PostController::class, 'posts_Details_Search']);

//댓글 조회
Route::get('/boards/{boardId}/comments', [CommentController::class, 'coments_List_Search']);

// 게시글 생성
Route::post('/posts', [PostController::class, 'store']);

// 댓글 생성
Route::post('/comments', [CommentController::class, 'store']);

//제목 OR 사용자 검색
Route::get('/boards/search', [BoardController::class, 'board_Search_By_Keyword']);