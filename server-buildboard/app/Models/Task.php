<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       'title','description','time_expected',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
       
    ];

    function History()
    {
       return $this->hasOne('App\History');
    }

    function TaskAttachment()
    {
       return $this->belongsTo('App\TaskAttachment');
    }

    function TaskState()
    {
       return $this->belongsTo('App\TaskState');
    }

    function WorkTime()
    {
       return $this->belongsTo('App\WorkTime');
    }

    function User()
    {
       return $this->hasOne('App\User');
    }

    function Priority()
    {
       return $this->hasOne('App\Priority');
    }

}