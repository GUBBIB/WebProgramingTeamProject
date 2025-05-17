<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // 🔐 회원가입
    public function register(Request $request)
    {
        $request->validate([
            'USR_email' => 'required|email|unique:users,USR_email',
            'USR_pass' => 'required|min:6',
            'USR_nickname' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'USR_email' => $request->USR_email,
            'USR_pass' => Hash::make($request->USR_pass),
            'USR_nickname' => $request->USR_nickname,
        ]);

        Auth::login($user); // 회원가입 후 자동 로그인

        return response()->json(['message' => '회원가입 완료', 'user' => $user], 201);
    }

    // 🔐 로그인
    public function login(Request $request)
    {
        $request->validate([
            'USR_email' => 'required|email',
            'USR_pass' => 'required',
        ]);

        $user = User::where('USR_email', $request->USR_email)->first();

        if (!$user || !Hash::check($request->USR_pass, $user->USR_pass)) {
            return response()->json(['message' => '이메일 또는 비밀번호가 잘못되었습니다.'], 401);
        }

        Auth::login($user); // 세션에 사용자 저장

        return response()->json(['message' => '로그인 성공', 'user' => $user]);
    }

    // 🔓 로그아웃
    public function logout(Request $request)
    {
        Auth::logout(); // 세션 삭제
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => '로그아웃 완료']);
    }

    // 👤 현재 로그인된 사용자 정보 확인
    public function user(Request $request)
    {
        return response()->json(Auth::user());
    }
}
