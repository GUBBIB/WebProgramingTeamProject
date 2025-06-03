<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
 * @OA\Schema(
 *     schema="Board",
 *     type="object",
 *     title="Board",
 *     required={"BRD_name"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="BRD_name", type="string", example="공지사항"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
class Board extends Model
{
    protected $primaryKey = 'BRD_id';

    protected $fillable = ['BRD_name'];

    public function posts()
    {
        return $this->hasMany(Post::class, 'BRD_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'USR_id');
    }
}