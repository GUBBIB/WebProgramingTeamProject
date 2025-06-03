<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/ai/code-review",
     *     summary="AI 코드 리뷰 요청",
     *     description="입력된 언어, 코드, 상황을 기반으로 GPT 모델을 이용해 코드 리뷰를 수행합니다.",
     *     operationId="aiCodeReview",
     *     tags={"AI"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"language","code","situation"},
     *             @OA\Property(property="language", type="string", example="java"),
     *             @OA\Property(property="code", type="string", example="int a = 3; int b = 10; printf(\'%%d\', a/b);"),
     *             @OA\Property(property="situation", type="string", example="실수가 아니라 정수가 나옴")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="AI 코드 리뷰 성공",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="result",
     *                 type="object",
     *                 @OA\Property(property="id", type="string", example="chatcmpl-BePb0p6PgWwvh9IRkGEUIN9K7UCR6"),
     *                 @OA\Property(property="object", type="string", example="chat.completion"),
     *                 @OA\Property(property="created", type="integer", example=1748971210),
     *                 @OA\Property(property="model", type="string", example="gpt-4o-mini-2024-07-18"),
     *                 @OA\Property(
     *                     property="choices",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="index", type="integer", example=0),
     *                         @OA\Property(
     *                             property="message",
     *                             type="object",
     *                             @OA\Property(property="role", type="string", example="assistant"),
     *                             @OA\Property(property="content", type="string", example="Java에서는 두 개의 정수(int) 타입을 나누면 결과도 정수형으로...")
     *                         ),
     *                         @OA\Property(property="finish_reason", type="string", example="stop")
     *                     )
     *                 ),
     *                 @OA\Property(
     *                     property="usage",
     *                     type="object",
     *                     @OA\Property(property="prompt_tokens", type="integer", example=78),
     *                     @OA\Property(property="completion_tokens", type="integer", example=340),
     *                     @OA\Property(property="total_tokens", type="integer", example=418)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="API 호출 실패",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Moderation API 호출 실패"),
     *             @OA\Property(property="debug", type="object")
     *         )
     *     )
     * )
     */

    public function ai_code_review(Request $request)
    {
        $language = $request->input('language');
        $code = $request->input('code');
        $situation = $request->input('situation');

        $apiKey = env('GPTAI_API_KEY');
        Log::info('GPTAI API Key:', ['api_key' => $apiKey]);

        $textToSend = "언어: $language\n코드: $code\n상황: $situation\n한국어로 왜 이런 상황이 나왔는지 구체적인 코드와 해결책을 제공해 주세요.";

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $apiKey,
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4o-mini',
            'store' => true,
            'messages' => [
                ['role' => 'user', 'content' => $textToSend]
            ]
        ]);

        if ($response->successful()) {
            return response()->json([
                'status' => 'success',
                'result' => $response->json(),
            ]);
        } else {
            Log::error('Moderation API 호출 실패', [
                'status_code' => $response->status(),
                'body' => $response->body(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Moderation API 호출 실패',
                'debug' => $response->json(),
            ], 500);
        }
    }
}
