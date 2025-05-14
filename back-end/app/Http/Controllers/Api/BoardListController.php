<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;

class BoardListController extends Controller
{
    // 게시글 목록 조회
    public function board_list()
    {
        $boards = Board::all();

        return response()->json([
            'data' => $boards
        ]);
    }
}
