<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/register",
     *     summary="회원가입",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"USR_email", "USR_pass"},
     *             @OA\Property(property="USR_email", type="string", format="email", example="test@example.com"),
     *             @OA\Property(property="USR_pass", type="string", format="password", example="password123"),
     *             @OA\Property(property="USR_nickname", type="string", example="nickname")
     *         )
     *     ),
     *     @OA\Response(response=201, description="회원가입 완료")
     * )
     */
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

        Auth::login($user);

        return response()->json(['message' => '회원가입 완료', 'user' => $user], 201);
    }

    /**
     * @OA\Post(
     *     path="/api/login",
     *     summary="로그인",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"USR_email", "USR_pass"},
     *             @OA\Property(property="USR_email", type="string", format="email", example="test@example.com"),
     *             @OA\Property(property="USR_pass", type="string", format="password", example="password123")
     *         )
     *     ),
     *     @OA\Response(response=200, description="로그인 성공"),
     *     @OA\Response(response=401, description="이메일 또는 비밀번호 오류")
     * )
     */
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

        Auth::login($user);

        return response()->json([
            'message' => '로그인 성공', 
            'user' => $user
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/logout",
     *     summary="로그아웃",
     *     tags={"Auth"},
     *     @OA\Response(response=200, description="로그아웃 완료")
     * )
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => '로그아웃 완료']);
    }

    /**
     * @OA\Get(
     *     path="/api/user",
     *     summary="현재 로그인된 사용자 정보 확인",
     *     tags={"Auth"},
     *     @OA\Response(response=200, description="사용자 정보 반환")
     * )
     */
    public function user(Request $request)
    {
        \Log::info("유저:", [$request->user()]);
        return response()->json(Auth::user());
    }

    /**
     * @OA\Put(
     *     path="/api/user/profile",
     *     summary="프로필 수정",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"USR_nickname"},
     *             @OA\Property(property="USR_nickname", type="string", example="new_nickname"),
     *             @OA\Property(property="USR_pass", type="string", example="newpassword123"),
     *             @OA\Property(property="USR_pass_confirmation", type="string", example="newpassword123")
     *         )
     *     ),
     *     @OA\Response(response=200, description="회원정보 수정 성공"),
     *     @OA\Response(response=401, description="로그인 필요"),
     *     @OA\Response(response=422, description="유효성 검사 실패")
     * )
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => '로그인이 필요합니다.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'USR_nickname' => 'required|string|max:255',
            'USR_pass' => 'nullable|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '유효성 검사 실패',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->USR_nickname = $request->USR_nickname;

        if ($request->filled('USR_pass')) {
            $user->USR_pass = Hash::make($request->USR_pass);
        }

        $user->save();

        return response()->json([
            'message' => '회원정보가 성공적으로 수정되었습니다.',
            'user' => $user
        ]);
    }

    public function showLoginForm(){
        return view('auth.login');
    }
}
