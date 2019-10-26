<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RoleAssigment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
       
    ];

    function User()
    {
       return $this->hasOne('App\User');
    }

    function Role()
    {
       return $this->hasOne('App\Role');
    }

}