<?php

// app/Http/Controllers/AuthController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    // 회원가입
    public function register(Request $request)
    {
        $request->validate([
            'USR_email' => 'required|email|unique:users,USR_email',
            'USR_pass' => 'required|min:6',
            'USR_nickname' => 'nullable|string'
        ]);

        $user = User::create([
            'USR_email' => $request->USR_email,
            'USR_pass' => Hash::make($request->USR_pass),
            'USR_nickname' => $request->USR_nickname
        ]);

        Auth::login($user); // 로그인 처리 (세션 저장)

        return response()->json([
            'message' => '회원가입 성공',
            'user' => $user,
        ]);
    }

    // 로그인
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'USR_email' => 'required|email',
            'USR_pass' => 'required'
        ]);

        $user = User::where('USR_email', $request->USR_email)->first();

        if (!$user || !Hash::check($request->USR_pass, $user->USR_pass)) {
            return response()->json(['message' => '로그인 실패'], 401);
        }

        Auth::login($user);

        return response()->json([
            'message' => '로그인 성공',
            'user' => $user
        ]);
    }

    // 현재 로그인한 사용자 정보
    public function getUser(Request $request)
    {
        return response()->json([
            'user' => Auth::user()
        ]);
    }

    // 로그아웃
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => '로그아웃 성공']);
    }
}
