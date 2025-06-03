<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Comments",
 *     type="object",
 *     title="Comments",
 *     required={"USR_id", "PST_id", "COM_content"},
 *     @OA\Property(property="COM_id", type="integer", example=1),
 *     @OA\Property(property="USR_id", type="integer", example=12),
 *     @OA\Property(property="PST_id", type="integer", example=101),
 *     @OA\Property(property="COM_content", type="string", example="이 글 정말 유익하네요!"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-06-01T12:34:56Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-06-01T12:35:00Z")
 * )
 */
class Comments extends Model
{
    protected $primaryKey = 'COM_id';

    protected $fillable = [
        'USR_id',
        'PST_id',
        'COM_content',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'USR_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class, 'PST_id');
    }
}
