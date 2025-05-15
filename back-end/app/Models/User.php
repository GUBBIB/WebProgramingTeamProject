<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users'; // 기본 테이블 명은 유지

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

    public function getAuthPassword()
    {
        return $this->USR_pass;
    }

    public function getAuthIdentifier()
    {
        return $this->USR_id;
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'USR_id');
    }

    public function comments()
    {
        return $this->hasMany(Comments::class, 'USR_id');
    }
}
