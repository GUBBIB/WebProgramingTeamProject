<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;
use App\Models\Post;
use App\Models\User;

class BoardController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/boards",
     *     summary="게시판 전체 목록 조회",
     *     tags={"Board"},
     *     @OA\Response(
     *         response=200,
     *         description="게시판 목록 반환",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Board"))
     *     )
     * )
     */
    public function board_List_Search()
    {
        $boards = Board::all();

        return response()->json($boards);
    }

    /**
     * @OA\Post(
     *     path="/api/boards",
     *     summary="게시판 생성",
     *     tags={"Board"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"BRD_name"},
     *             @OA\Property(property="BRD_name", type="string", example="자유게시판")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="게시판 생성 성공",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="게시판이 생성되었습니다."),
     *             @OA\Property(property="board", ref="#/components/schemas/Board")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="유효성 검사 실패"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'BRD_name' => 'required|string|max:255',
        ]);

        $board = Board::create([
            'BRD_name' => $validated['BRD_name'],
        ]);

        return response()->json([
            'message' => '게시판이 생성되었습니다.',
            'board' => $board,
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/boards/search",
     *     summary="게시글 검색 (제목 또는 작성자 기준)",
     *     tags={"Board"},
     *     @OA\Parameter(
     *         name="keyword",
     *         in="query",
     *         required=true,
     *         description="검색 키워드",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="field",
     *         in="query",
     *         required=true,
     *         description="검색 기준: title 또는 user",
     *         @OA\Schema(type="string", enum={"title", "user"})
     *     ),
     *     @OA\Parameter(
     *         name="BRD_id",
     *         in="query",
     *         required=false,
     *         description="게시판 ID (전체는 1)",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="검색 결과 반환",
     *         @OA\JsonContent(
     *             @OA\Property(property="field", type="string", example="title"),
     *             @OA\Property(property="keyword", type="string", example="공지"),
     *             @OA\Property(property="results", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="잘못된 검색 조건"
     *     )
     * )
     */
    public function board_Search_By_Keyword(Request $request)
    {
        $keyword = $request->input('keyword');
        $field = $request->input('field');
        $BRD_id = $request->input('BRD_id');

        if (!$keyword || !$field) {
            return response()->json([
                'message' => '검색어와 검색 기준을 모두 입력해주세요.'
            ], 400);
        }

        $query = Post::with('user', 'board');

        if ($BRD_id && intval($BRD_id) !== 1) {
            $query->where('BRD_id', $BRD_id);
        }

        if ($field === 'title') {
            $query->where('PST_title', 'like', "%{$keyword}%");
        } elseif ($field === 'user') {
            $query->whereHas('user', function ($q) use ($keyword) {
                $q->where('USR_nickname', 'like', "%{$keyword}%");
            });
        } else {
            return response()->json(['message' => '검색 기준은 title 또는 user 중 하나여야 합니다.'], 400);
        }

        $results = $query->paginate(15);

        return response()->json([
            'field' => $field,
            'keyword' => $keyword,
            'results' => $results
        ]);
    }
}
