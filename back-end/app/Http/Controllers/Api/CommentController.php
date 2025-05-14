<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;
use App\Models\Comments;
use App\Models\Post;

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

    public function store(Request $request, $PST_id){
        $request->validate([
            'USR_id' => 'required|exists:users,USR_id',
            'COM_content' => 'required|string',
        ]);

        $post = Post::find($PST_id);
        if(!$post){
            return response() -> json([
                'message' => '해당 게시글을 찾을 수 없습니다.'
            ], 404);
        }

        $comment = Comments::create([
            'USR_id' => $request->input('USR_id'),
            'PST_id' => $PST_id,
            'COM_content' => $request->input('COM_content'),
        ]);

        return response()->json([
            'message' => '댓글이 성공적으로 작성되었습니다.',
            'data' => $comment
        ], 201);

    }
}
