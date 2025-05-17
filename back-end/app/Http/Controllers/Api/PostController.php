<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Board;

class PostController extends Controller
{
    // 게시글 생성
    public function store(Request $request)
    {
        // ✅ 1. 로그인 사용자 확인
        if (!$request->user()) {
            return response()->json(['message' => '로그인이 필요합니다.'], 401);
        }

        // ✅ 2. 유효성 검사 (USR_id 제거)
        $validated = $request->validate([
            'BRD_id' => 'required|exists:boards,BRD_id',
            'USR_id' => 'required|exists:users,BRD_id',
            'PST_title' => 'required|string',
            'PST_content' => 'required|string',
        ]);

        // ✅ 3. 게시글 생성
        $post = Post::create([
            'BRD_id' => $validated['BRD_id'],
            'USR_id' => $validated['USR_id'], // 여기서 사용자 ID 지정
            'PST_title' => $validated['PST_title'],
            'PST_content' => $validated['PST_content'],
        ]);

        // ✅ 4. 응답 반환
        return response()->json([
            'message' => '게시글이 성공적으로 작성되었습니다.',
            'PST_id' => $post->PST_id,
            'data' => $post
        ], 201);
    }

    // 아래 나머지 함수는 그대로 유지
    public function posts_Details_Search(Board $BRD_id, Post $PST_id)
    {
        $board = Board::find($BRD_id);

        if (!$board) {
            return response()->json(['message' => '해당 게시글을 찾을 수 없습니다.'], 404);
        }

        $post = Post::with('user')
                    ->where('PST_id', $PST_id)
                    ->where('BRD_id', $BRD_id)
                    ->first();

        if (!$post) {
            return response()->json(['message' => '해당 게시글을 찾을 수 없습니다.'], 404);
        }

        return response()->json(['data' => $post]);
    }

    public function post_List_Search($BRD_id)
    {
        $posts = Post::with('user')
                     ->where('BRD_id', $BRD_id)
                     ->orderBy('created_at', 'desc')
                     ->paginate(15);

        return response()->json($posts);
    }

    public function posts_All_List_Search(Request $request)
    {
        $posts = Post::with(['user', 'board'])
                     ->orderBy('created_at', 'desc')
                     ->paginate(15);

        return response()->json($posts);
    }

    public function incrementViews($BRD_id, $PST_id)
    {
        $post = Post::where('BRD_id', $BRD_id)
                    ->where('PST_id', $PST_id)
                    ->first();

        if (!$post) {
            return response()->json(['message' => '게시글을 찾을 수 없습니다.'], 404);
        }

        $post->increment('PST_views');

        return response()->json([
            'message' => '조회수 증가 완료',
            'views' => $post->PST_views
        ]);
    }
}
