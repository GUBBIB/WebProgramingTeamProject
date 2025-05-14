<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    protected $primaryKey = 'USR_id';
    public $timestamps = false;

    protected $fillable = [
        'USR_email',
        'USR_pass',
        'USR_created_at',
    ];

    protected $hidden = [
        'USR_pass',
    ];

    protected function casts(): array
    {
        return [
            'USR_created_at' => 'date',
        ];
    }
}
