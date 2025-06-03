<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
 * @OA\Schema(
 *     schema="Post",
 *     type="object",
 *     title="Post",
 *     required={"BRD_id", "USR_id", "PST_title", "PST_content"},
 *     @OA\Property(property="PST_id", type="integer", example=1),
 *     @OA\Property(property="BRD_id", type="integer", example=2),
 *     @OA\Property(property="USR_id", type="integer", example=3),
 *     @OA\Property(property="PST_title", type="string", example="라라벨 게시판 만들기"),
 *     @OA\Property(property="PST_content", type="string", example="이 글은 라라벨로 만든 게시판 예제입니다."),
 *     @OA\Property(property="PST_views", type="integer", example=123),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-06-01T12:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-06-01T12:10:00Z")
 * )
 */
class Post extends Model
{
    protected $primaryKey = 'PST_id';

    protected $fillable = [
        'BRD_id',
        'USR_id',
        'PST_title',
        'PST_content',
        'PST_views',
    ];

    // timestamps()를 사용하는 경우 true가 기본값이므로 명시할 필요 없음
    // public $timestamps = true; 생략 가능

    // 관계 설정
    public function user()
    {
        return $this->belongsTo(User::class, 'USR_id');
    }

    public function board()
    {
        return $this->belongsTo(Board::class, 'BRD_id');
    }

    public function comments()
    {
        return $this->hasMany(Comments::class, 'PST_id');
    }
}
