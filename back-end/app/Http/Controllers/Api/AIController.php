<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{

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
            'Authorization' => 'Bearer ' . $apiKey,  // api-key를 Bearer 형식으로 추가
        ])->post('https://api.deepai.org/api/text-generator', [
            'text' => $textToSend,
        ]);
        
        if ($response->successful()) {

            $review = $response->json();

            return response()->json([
                'status' => 'success',
                'review' => $review
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'AI 호출 실패'
        ], 500);
    }
}
