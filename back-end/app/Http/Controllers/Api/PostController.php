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
        if (!$request->user()) {
            return response()->json(['message' => '로그인이 필요합니다.'], 401);
        }

        $validated = $request->validate([
            'BRD_id' => 'required|exists:boards,BRD_id',
            'PST_title' => 'required|string',
            'PST_content' => 'required|string',
        ]);

        $post = Post::create([
            'BRD_id' => $validated['BRD_id'],
            'USR_id' => $request->user()->USR_id,
            'PST_title' => $validated['PST_title'],
            'PST_content' => $validated['PST_content'],
        ]);

        return response()->json([
            'message' => '게시글이 성공적으로 작성되었습니다.',
            'PST_id' => $post->PST_id,
            'data' => $post
        ], 201);
    }

    // 게시글 상세 조회
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

    // 특정 게시판의 게시글 목록
    public function post_List_Search($BRD_id)
    {
        $posts = Post::with('user')
                     ->where('BRD_id', $BRD_id)
                     ->orderBy('created_at', 'desc')
                     ->paginate(15);

        return response()->json($posts);
    }

    // 전체 게시글 목록
    public function posts_All_List_Search(Request $request)
    {
        $posts = Post::with(['user', 'board'])
                     ->orderBy('created_at', 'desc')
                     ->paginate(15);

        return response()->json($posts);
    }

    // 게시글 조회수 증가
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

    // 게시글 검색 (제목 또는 작성자 닉네임 기준)
    public function searchByField(Request $request)
    {
        $keyword = $request->input('keyword');
        $field = $request->input('field'); // 'title' 또는 'user'

        if (!$keyword || !$field) {
            return response()->json([
                'message' => '검색어와 검색 기준을 모두 입력해주세요.'
            ], 400);
        }

        if ($field === 'title') {
            $posts = Post::with(['user', 'board'])
                         ->where('PST_title', 'like', "%{$keyword}%")
                         ->orderBy('created_at', 'desc')
                         ->paginate(15);
        } elseif ($field === 'user') {
            $posts = Post::with(['user', 'board'])
                         ->whereHas('user', function ($query) use ($keyword) {
                             $query->where('USR_nickname', 'like', "%{$keyword}%");
                         })
                         ->orderBy('created_at', 'desc')
                         ->paginate(15);
        } else {
            return response()->json([
                'message' => '검색 기준은 "title" 또는 "user"여야 합니다.'
            ], 400);
        }

        return response()->json([
            'message' => '검색 완료',
            'count' => $posts->total(),
            'data' => $posts
        ]);
    }
}
