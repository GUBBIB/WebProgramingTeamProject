<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Board;

class PostController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/posts",
     *     summary="게시글 생성",
     *     tags={"Post"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"BRD_id", "USR_id", "PST_title", "PST_content"},
     *             @OA\Property(property="BRD_id", type="integer", example=1),
     *             @OA\Property(property="USR_id", type="integer", example=2),
     *             @OA\Property(property="PST_title", type="string", example="게시글 제목"),
     *             @OA\Property(property="PST_content", type="string", example="게시글 내용")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="게시글 생성 성공",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="게시글이 성공적으로 작성되었습니다."),
     *             @OA\Property(property="data", type="object")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'BRD_id' => 'required|exists:boards,BRD_id',
            'USR_id' => 'required|exists:users,USR_id',
            'PST_title' => 'required|string',
            'PST_content' => 'required|string',
        ]);

        $post = Post::create($validated);

        return response()->json([
            'message' => '게시글이 성공적으로 작성되었습니다.',
            'data' => $post
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/boards/{BRD_id}/posts/{PST_id}",
     *     summary="게시글 상세 조회",
     *     tags={"Post"},
     *     @OA\Parameter(name="BRD_id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="PST_id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="게시글 상세 정보 반환"),
     *     @OA\Response(response=404, description="게시글을 찾을 수 없음")
     * )
     */
    public function posts_Details_Search($BRD_id, $PST_id)
    {
        $board = Board::find($BRD_id);

        if (!$board) {
            return response()->json(['message' => '해당 게시글을 찾을 수 없습니다.'], 404);
        }

        $post = Post::with('user', 'board')
                    ->where('PST_id', $PST_id)
                    ->where('BRD_id', $BRD_id)
                    ->first();

        if (!$post) {
            return response()->json(['message' => '해당 게시글을 찾을 수 없습니다.'], 404);
        }

        return response()->json(['data' => $post]);
    }

    /**
     * @OA\Get(
     *     path="/api/boards/{BRD_id}",
     *     summary="특정 게시판의 게시글 목록 조회",
     *     tags={"Post"},
     *     @OA\Parameter(name="BRD_id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="게시글 목록 반환")
     * )
     */
    public function post_List_Search($BRD_id)
    {
        $posts = Post::with('user', 'board')
                     ->where('BRD_id', $BRD_id)
                     ->orderBy('created_at', 'desc')
                     ->paginate(15);

        return response()->json($posts);
    }

    /**
     * @OA\Get(
     *     path="/api/boards/all",
     *     summary="전체 게시글 목록 조회",
     *     tags={"Post"},
     *     @OA\Response(response=200, description="전체 게시글 목록 반환")
     * )
     */
    public function posts_All_List_Search(Request $request)
    {
        $posts = Post::with(['user', 'board'])
                     ->orderBy('created_at', 'desc')
                     ->paginate(15);

        return response()->json($posts);
    }

    /**
     * @OA\Post(
     *     path="/api/boards/{BRD_id}/posts/{PST_id}/view",
     *     summary="게시글 조회수 증가",
     *     tags={"Post"},
     *     @OA\Parameter(name="BRD_id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="PST_id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="조회수 증가 완료"),
     *     @OA\Response(response=404, description="게시글을 찾을 수 없음")
     * )
     */
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

    /**
     * @OA\Put(
     *     path="/api/posts/{PST_id}",
     *     summary="게시글 수정",
     *     tags={"Post"},
     *     @OA\Parameter(name="PST_id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"PST_title", "PST_content"},
     *             @OA\Property(property="PST_title", type="string", example="수정된 제목"),
     *             @OA\Property(property="PST_content", type="string", example="수정된 내용")
     *         )
     *     ),
     *     @OA\Response(response=200, description="게시글 수정 성공"),
     *     @OA\Response(response=404, description="게시글을 찾을 수 없음")
     * )
     */
    public function update(Request $request, $PST_id)
    {
        $post = Post::find($PST_id);

        if (!$post) {
            return response()->json(['message' => '게시글을 찾을 수 없습니다.'], 404);
        }

        $validated = $request->validate([
            'PST_title' => 'required|string',
            'PST_content' => 'required|string',
        ]);

        $post->update($validated);

        return response()->json([
            'message' => '게시글이 성공적으로 수정되었습니다.',
            'data' => $post
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/posts/{PST_id}",
     *     summary="게시글 삭제",
     *     tags={"Post"},
     *     @OA\Parameter(name="PST_id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="게시글 삭제 성공"),
     *     @OA\Response(response=404, description="게시글을 찾을 수 없음")
     * )
     */
    public function destroy($PST_id)
    {
        $post = Post::find($PST_id);

        if (!$post) {
            return response()->json(['message' => '게시글을 찾을 수 없습니다.'], 404);
        }

        $post->delete();

        return response()->json(['message' => '게시글이 성공적으로 삭제되었습니다.']);
    }
}
