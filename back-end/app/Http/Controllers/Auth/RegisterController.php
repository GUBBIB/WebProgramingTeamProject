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
        $validated = $request->validate([
            'USR_email' => 'required|email|unique:users,USR_email',
            'USR_nickname' => 'required|string',
            'USR_pass' => 'required|min:6',
        ]);

        $user = User::create([
            'USR_email' => $validated['USR_email'],
            'USR_nickname' => $validated['USR_nickname'],
            'USR_pass' => Hash::make($validated['USR_pass']),
        ]);

        return response()->json(['message' => '회원가입 성공'], 201);
    }
}
