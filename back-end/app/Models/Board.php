<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    protected $primaryKey = 'BRD_id';
    public $timestamps = false;

    protected $fillable = ['BRD_name'];

    public function posts() {
        return $this->hasMany(Post::class, 'BRD_id');
    }
}

