<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;
use App\Models\Post;

class BoardController extends Controller
{
    public function board_List_Search()
    {
        $boards = Board::all();

        return response()->json($boards);
    }

    
}
