<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;

class CommentController extends Controller
{
    // 특정 게시글의 댓글 목록 조회
    public function coments_List_Search($boardId)
    {
        $board = Board::with('comments')->find($boardId);

        if (!$board) {
            return response()->json(['message' => '게시글을 찾을 수 없습니다.'], 404);
        }

        return response()->json([
            'board_id' => $boardId,
            'comments' => $board->comments
        ]);
    }
}
