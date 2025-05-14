<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;

class BoardDetailController extends Controller
{
    // 게시글 상세 조회
    public function show($id)
    {
        $board = Board::find($id);

        if (!$board) {
            return response()->json([
                'message' => '해당 게시글을 찾을 수 없습니다.'
            ], 404);
        }

        return response()->json($board);
    }
}



