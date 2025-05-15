<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'USR_email' => 'required|email|unique:users,USR_email',
            'USR_pass' => 'required|min:6',
        ]);

        $user = User::create([
            'USR_email' => $request->input('USR_email'),
            'USR_pass' => Hash::make($request->input('USR_pass')),
        ]);

        if(!$user){
            return response()->json([
                'message' => '회원가입 실패'
            ], 500);
        }

        return response()->json(['message' => '회원가입 완료', 'user' => $user]);
    }
}