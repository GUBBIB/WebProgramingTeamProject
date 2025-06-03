<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;
use App\Models\Comments;
use App\Models\Post;

class CommentController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/boards/{BRD_id}/posts/{PST_id}/comments",
     *     summary="특정 게시글의 댓글 목록 조회",
     *     tags={"Comment"},
     *     @OA\Parameter(
     *         name="BRD_id",
     *         in="path",
     *         required=true,
     *         description="게시판 ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="PST_id",
     *         in="path",
     *         required=true,
     *         description="게시글 ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="댓글 목록 반환",
     *         @OA\JsonContent(
     *             @OA\Property(property="post_id", type="integer", example=3),
     *             @OA\Property(property="post_title", type="string", example="3번 게시글입니다"),
     *             @OA\Property(property="board_id", type="integer", example=1),
     *             @OA\Property(
     *                 property="comments",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="COM_id", type="integer", example=1),
     *                     @OA\Property(property="USR_id", type="integer", example=5),
     *                     @OA\Property(property="USR_nickname", type="string", example="닉네임"),
     *                     @OA\Property(property="COM_content", type="string", example="댓글 내용입니다"),
     *                     @OA\Property(property="created_at", type="string", format="date-time")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="게시글을 찾을 수 없음"
     *     )
     * )
     */
    public function coments_List_Search($BRD_id, $PST_id)
    {
        $post = Post::with(['comments.user'])
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

    /**
     * @OA\Post(
     *     path="/api/comments",
     *     summary="댓글 작성 및 전체 목록 반환",
     *     tags={"Comment"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"USR_id", "PST_id", "COM_content"},
     *             @OA\Property(property="USR_id", type="integer", example=2),
     *             @OA\Property(property="PST_id", type="integer", example=5),
     *             @OA\Property(property="COM_content", type="string", example="댓글을 작성합니다")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="댓글 작성 성공 및 전체 댓글 반환",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="댓글이 성공적으로 작성되었습니다."),
     *             @OA\Property(property="new_comment", type="object"),
     *             @OA\Property(property="all_comments", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="게시글 존재하지 않음"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="유효성 검사 실패"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'USR_id' => 'required|exists:users,USR_id',
            'PST_id' => 'required|exists:posts,PST_id',
            'COM_content' => 'required|string',
        ]);

        $USR_id = $request->input('USR_id');
        $PST_id = $request->input('PST_id');

        $postExists = Post::where('PST_id', $PST_id)->exists();

        if (!$postExists) {
            return response()->json([
                'message' => '해당 게시글이 존재하지 않습니다.'
            ], 404);
        }

        $comment = Comments::create([
            'USR_id' => $USR_id,
            'PST_id' => $PST_id,
            'COM_content' => $request->input('COM_content'),
        ]);
        $comment->load('user');

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
