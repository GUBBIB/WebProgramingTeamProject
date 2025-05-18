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
    public function comemnts_List_Search($BRD_id, $PST_id)
    {
        $post = Post::with(['comments.user']) // 댓글 + 작성자까지 eager load
            ->where('BRD_id', $BRD_id)
            ->where('PST_id', $PST_id)
            ->first();

        if (!$post) {
            return response()->json(['message' => '해당 게시글을 찾을 수 없습니다.'], 404);
        }

        return response()->json([
            'post_id' => $PST_id,
            'post_title' => $post->PST_title,
            'board_id' => $BRD_id,
            'comments' => $post->comments->map(function ($comment) {
                return [
                    'COM_id' => $comment->COM_id,
                    'USR_id' => $comment->USR_id,
                    'USR_nickname' => $comment->user->USR_nickname ?? '알 수 없음',
                    'COM_content' => $comment->COM_content,
                    'created_at' => $comment->created_at,
                ];
            }),
        ]);
    }

    // 댓글 작성 및 전체 목록 반환
    public function store(Request $request)
    {
        $request->validate([
            'USR_id' => 'required|exists:users,USR_id',
            'PST_id' => 'required|exists:posts,PST_id',
            'COM_content' => 'required|string',
        ]);

        $USR_id = $request->input('USR_id');
        $PST_id = $request->input('PST_id');

        // 게시글 존재 확인
        $postExists = Post::where('PST_id', $PST_id)->exists();

        if (!$postExists) {
            return response()->json([
                'message' => '해당 게시글이 존재하지 않습니다.'
            ], 404);
        }

        // 댓글 저장
        $comment = Comments::create([
            'USR_id' => $USR_id,
            'PST_id' => $PST_id,
            'COM_content' => $request->input('COM_content'),
        ]);
        $comment->load('user');

        // 전체 댓글 조회
        $allComments = Comments::with('user')
            ->where('PST_id', $PST_id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'message' => '댓글이 성공적으로 작성되었습니다.',
            'new_comment' => [
                'COM_id' => $comment->COM_id,
                'USR_id' => $comment->USR_id,
                'USR_nickname' => $comment->user->USR_nickname ?? '알 수 없음',
                'COM_content' => $comment->COM_content,
                'created_at' => $comment->created_at,
            ],
            'all_comments' => $allComments->map(function ($comment) {
                return [
                    'COM_id' => $comment->COM_id,
                    'USR_id' => $comment->USR_id,
                    'USR_nickname' => $comment->user->USR_nickname ?? '알 수 없음',
                    'COM_content' => $comment->COM_content,
                    'created_at' => $comment->created_at,
                ];
            }),
        ], 201);
    }
}
