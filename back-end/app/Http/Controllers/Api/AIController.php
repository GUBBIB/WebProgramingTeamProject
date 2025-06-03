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
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $apiKey,
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'input' => $textToSend,
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
