<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="User",
 *     required={"USR_email", "USR_pass"},
 *     @OA\Property(property="USR_id", type="integer", example=1),
 *     @OA\Property(property="USR_email", type="string", example="user@example.com"),
 *     @OA\Property(property="USR_pass", type="string", format="password", example="hashed_password"),
 *     @OA\Property(property="USR_nickname", type="string", example="홍길동"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-06-01T12:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-06-01T12:10:00Z")
 * )
 */
class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'USR_id';

    protected $fillable = [
        'USR_email',
        'USR_pass',
        'USR_nickname',
    ];

    protected $hidden = [
        'USR_pass',
    ];

    public function getAuthIdentifierName()
    {
        return 'USR_id';
    }

    // app/Models/User.php

    public function getAuthPassword()
    {
        return $this->USR_pass;
    }
}
