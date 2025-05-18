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
        // // ✅ 1. 로그인 사용자 확인
        // if (!$request->user()) {
        //     return response()->json(['message' => '로그인이 필요합니다.'], 401);
        // }

        // ✅ 2. 유효성 검사 (USR_id 제거)
        $validated = $request->validate([
            'BRD_id' => 'required|exists:boards,BRD_id',
            'USR_id' => 'required|exists:users,USR_id',
            'PST_title' => 'required|string',
            'PST_content' => 'required|string',
        ]);

        $post = Post::create([
            'BRD_id' => $validated['BRD_id'],
            'USR_id' => $validated['USR_id'], // 여기서 사용자 ID 지정
            'PST_title' => $validated['PST_title'],
            'PST_content' => $validated['PST_content'],
        ]);

        return response()->json([
            'message' => '게시글이 성공적으로 작성되었습니다.',
            'data' => $post
        ], 201);
    }

    // 게시글 상세 조회
    public function posts_Details_Search($BRD_id, $PST_id)
    {
        $board = Board::find($BRD_id);

        if (!$board) {
            return response()->json(['message' => '해당 게시글을 찾을 수 없습니다.'], 404);
        }

        $post = Post::with('user', 'board')
                    ->where('PST_id', $PST_id)
                    ->where('BRD_id', $BRD_id)
                    ->first();

        if (!$post) {
            return response()->json(['message' => '해당 게시글을 찾을 수 없습니다.'], 404);
        }

        return response()->json([
            'data' => $post,
        ]);
    }

    // 특정 게시판 게시글 목록 조회
    public function post_List_Search($BRD_id)
    {
        $posts = Post::with('user', 'board')
                     ->where('BRD_id', $BRD_id)
                     ->orderBy('created_at', 'desc')
                     ->paginate(15);

        return response()->json($posts);
    }

    // 전체 게시글 목록 조회
    public function posts_All_List_Search(Request $request)
    {
        $posts = Post::with(['user', 'board'])
                     ->orderBy('created_at', 'desc')
                     ->paginate(15);

        return response()->json($posts);
    }

    // 조회수 api
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

    // ✅ 게시글 수정
    public function update(Request $request, $PST_id)
    {
        $post = Post::find($PST_id);

        if (!$post) {
            return response()->json(['message' => '게시글을 찾을 수 없습니다.'], 404);
        }

        $validated = $request->validate([
            'PST_title' => 'required|string',
            'PST_content' => 'required|string',
        ]);

        $post->update($validated);

        return response()->json([
            'message' => '게시글이 성공적으로 수정되었습니다.',
            'data' => $post
        ]);
    }

    // ✅ 게시글 삭제
    public function destroy($PST_id)
    {
        $post = Post::find($PST_id);

        if (!$post) {
            return response()->json(['message' => '게시글을 찾을 수 없습니다.'], 404);
        }

        $post->delete();

        return response()->json(['message' => '게시글이 성공적으로 삭제되었습니다.']);
    }

    
}