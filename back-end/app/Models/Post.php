<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $primaryKey = 'PST_id';

    protected $fillable = ['PST_title', 'PST_content', 'BRD_id', 'USR_id'];

    public function user() {
        return $this->belongsTo(User::class, 'USR_id');
    }

    public function board() {
        return $this->belongsTo(Board::class, 'BRD_id');
    }

    public function comments() {
        return $this->hasMany(Comment::class, 'PST_id');
    }
}
