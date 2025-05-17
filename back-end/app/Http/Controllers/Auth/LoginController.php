<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'USR_email' => 'required|email',
            'USR_pass' => 'required',
        ]);

        $user = User::where('USR_email', $request->input('USR_email'))->first();

        if (!$user || !Hash::check($request->input('USR_pass'), $user->USR_pass)) {
            return response()->json(['message' => '이메일 또는 비밀번호가 틀렸습니다.'], 401);
        }

        Auth::login($user); // 세션 로그인
        $request->session()->regenerate(); // ← 이거 꼭 있어야 쿠키가 생김

        return response()->json([
            'message' => '로그인 성공',
            'user' => [
                'USR_id' => $user->USR_id,
                'USR_email' => $user->USR_email,
                'USR_nickname' => $user->USR_nickname,
            ]
        ]);
    }
}