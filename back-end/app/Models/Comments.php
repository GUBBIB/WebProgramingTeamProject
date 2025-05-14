<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
