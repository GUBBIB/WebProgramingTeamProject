<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

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

    public function getAuthIdentifierName()
    {
        return 'USR_id';
    }

    public function getAuthPassword()
    {
        return $this->USR_pass;
    }
}
