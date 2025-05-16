<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
