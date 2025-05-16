<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Auth;
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
        'USR_nickname' => $request->input('USR_nickname') ?? '신입 유저',
    ]);

    if (!$user) {
        return response()->json(['message' => '회원가입 실패'], 500);
    }

    Auth::login($user); // 로그인 처리 (선택사항)

    return response()->json([
        'message' => '회원가입 완료',
        'user' => [
            'USR_id' => $user->USR_id,
            'USR_email' => $user->USR_email,
            'USR_nickname' => $user->USR_nickname,
        ]
    ]);
}

}