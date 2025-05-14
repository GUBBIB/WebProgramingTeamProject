<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;

class BoardController extends Controller
{
    public function board_list_search()
    {
        $boards = Board::all();

        return response()->json($boards);
    }
}
