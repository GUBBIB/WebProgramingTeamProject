<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIController extends Controller
{
    /**
     * Handle ChatGPT API request
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function askOpenAI(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:1000',
        ]);

        try {
            // Get the OpenAI API key from environment variables
            $apiKey = env('OPENAI_API_KEY');
            
            if (!$apiKey) {
                Log::error('OpenAI API key is not set in environment variables');
                return response()->json(['error' => '서버 설정 오류가 발생했습니다.'], 500);
            }

            // Make request to OpenAI API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => '당신은 질문게시판의 도우미입니다. 질문에 간결하고 정확하게 답변해주세요.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $request->question
                    ]
                ],
                'max_tokens' => 500,
                'temperature' => 0.7,
            ]);

            $responseData = $response->json();
            
            if (!$response->successful()) {
                Log::error('OpenAI API error: ', $responseData);
                return response()->json(['error' => 'AI 서비스 연결에 실패했습니다.'], 500);
            }

            return response()->json([
                'answer' => $responseData['choices'][0]['message']['content']
            ]);

        } catch (\Exception $e) {
            Log::error('OpenAI integration error: ' . $e->getMessage());
            return response()->json(['error' => '서버 처리 중 오류가 발생했습니다.'], 500);
        }
    }
}