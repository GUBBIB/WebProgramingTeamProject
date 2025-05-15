<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
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

    public function posts()
    {
        return $this->hasMany(Post::class, 'USR_id');
    }

    public function comments()
    {
        return $this->hasMany(Comments::class, 'USR_id');
    }
}
