<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TaskState extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       'date_time','comment',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
       
    ];

    function Task()
    {
       return $this->hasOne('App\Task');
    }

    function State()
    {
       return $this->hasOne('App\State');
    }

    function User()
    {
       return $this->hasOne('App\User');
    }

}