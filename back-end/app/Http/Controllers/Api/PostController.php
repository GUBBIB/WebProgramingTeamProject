<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    public function board_list_search($boardId)
    {
        $posts = Post::with('user') // 작성자 정보 포함
            ->where('BRD_id', $boardId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($posts);
    }
}
