<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;
use App\Models\Post; // 현재는 사용되지 않지만 유지
use App\Models\User;

class BoardController extends Controller
{
    // 게시글 전체 목록 조회
    public function board_List_Search()
    {
        $boards = Board::all();

        return response()->json($boards);
    }

    // 게시판 생성 
    public function store(Request $request)
    {
        // 유효성 검사
        $validated = $request->validate([
            'BRD_name' => 'required|string|max:255',
        ]);

        // 게시판 생성
        $board = Board::create([
            'BRD_name' => $validated['BRD_name'],
        ]);

        return response()->json([
            'message' => '게시판이 생성되었습니다.',
            'board' => $board,
        ], 201);
    }

    // 게시글 검색 (제목 또는 작성자 이름 기준)
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