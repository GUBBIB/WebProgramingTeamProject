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
     *             @OA\Property(property="language", type="string", example="php"),
     *             @OA\Property(property="code", type="string", example="echo 'Hello';"),
     *             @OA\Property(property="situation", type="string", example="코드가 동작하지 않음")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="AI 코드 리뷰 성공",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="result", type="object")
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

        // 사용자 입력 정보들
        $language = $request->input('language');
        $code = $request->input('code');
        $situation = $request->input('situation');

        // api key
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
            // 실패한 경우
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
