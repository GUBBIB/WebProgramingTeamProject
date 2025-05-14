<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use app\Models\Post;

class PostController extends Controller
{
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
}
