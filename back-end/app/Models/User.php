<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $primaryKey = 'USR_id';

    protected $fillable = [
        'USR_email',
        'USR_pass',
    ];

    protected $hidden = [
        'USR_pass',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class, 'USR_id');
    }

    public function comments()
    {
        return $this->hasMany(Comments::class, 'USR_id');
    }
}
