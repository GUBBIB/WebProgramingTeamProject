<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use app\Models\Post;
use app\Models\Board;

class PostController extends Controller
{
    // 게시글 생성
    public function store(Request $request){
        $validated = $request -> validate([
            'BRD_id' => 'required|exists:boards,BRD_id',
            'USR_id' => 'required|exists:users,USR_id',
            'PST_title' => 'required|string',
            'PST_content' => 'required|string',
        ]);

        $post = Post::create([
            'BRD_id' => $validated['BRD_id'],
            'USR_id' => $validated['USR_id'],
            'PST_title' => $validated['PST_title'],
            'PST_content' => $validated['PST_content'],
        ]);

        return response() -> json([
            'message' => '게시글이 성공적으로 작성되었습니다.',
            'data' => $post
        ], 201);
    }

    // 게시글 목록 조회
    public function post_List_Search(Board $BRD_id)
    {
        $posts = Post::with('user')
                    ->where('BRD_id', $BRD_id)
                    ->orderBy('created_at', 'desc')
                    ->paginate(15); //15개씩 들고오기

        return response()->json([
            'data' => $posts
        ]);
    }

    // 게시글 상세 조회
    public function posts_Details_Search(Board $BRD_id, Post $PST_id)
    {
        $board = Board::find($BRD_id);

        if (!$board) {
            return response()->json([
                'message' => '해당 게시글을 찾을 수 없습니다.'
            ], 404);
        }

        $post = Post::with('user')
                    ->where('PST_id', $PST_id)
                    ->where('BRD_id', $BRD_id)
                    ->first();

        if(!$post){
            return response()->json([
                'message' => '해당 게시글을 찾을 수 없습니다.'
            ], 404);
        }

        return response()->json([
            'data' => $post
        ]);
    }

    public function posts_All_List_Search(){
        
    }
}
