<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $primaryKey = 'COM_id';
    public $timestamps = false;

    protected $fillable = ['USR_id', 'PST_id', 'COM_content', 'COM_createDay'];

    public function user() {
        return $this->belongsTo(User::class, 'USR_id');
    }

    public function post() {
        return $this->belongsTo(Post::class, 'PST_id');
    }
}
