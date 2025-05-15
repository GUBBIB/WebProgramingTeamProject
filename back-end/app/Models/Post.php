<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $primaryKey = 'PST_id';

    protected $fillable = [
        'BRD_id',
        'USR_id',
        'PST_title',
        'PST_content',
        'PST_views',
    ];

    // timestamps()를 사용하는 경우 true가 기본값이므로 명시할 필요 없음
    // public $timestamps = true; 생략 가능

    // 관계 설정
    public function user()
    {
        return $this->belongsTo(User::class, 'USR_id');
    }

    public function board()
    {
        return $this->belongsTo(Board::class, 'BRD_id');
    }

    public function comments()
    {
        return $this->hasMany(Comments::class, 'PST_id');
    }
}
