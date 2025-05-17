<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // 회원가입
    public function register(Request $request)
    {
        $validated = $request->validate([
            'USR_email' => 'required|email|unique:users,USR_email',
            'USR_pass' => 'required|min:8',
            'USR_nickname' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'USR_email' => $validated['USR_email'],
            'USR_pass' => Hash::make($validated['USR_pass']),
            'USR_nickname' => $validated['USR_nickname'] ?? null,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['user' => $user], 201);
    }

    // 로그인
    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'USR_email' => 'required|email',
                'USR_pass' => 'required',
            ]);

            $user = User::where('USR_email', $credentials['USR_email'])->first();

            if (!$user || !Hash::check($credentials['USR_pass'], $user->USR_pass)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            Auth::login($user);  // 여기에서 getAuthPassword() 호출됨
            $request->session()->regenerate();

            return response()->json(['user' => $user]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }


    // 로그아웃
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }

    // 로그인된 유저 정보
    public function user(Request $request)
    {
        return response()->json(['user' => Auth::user()]);
    }
}
