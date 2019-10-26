<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       'description','source','dod_date_time','dor_date_time',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
       
    ];

    function HistoryAttachment()
    {
       return $this->belongsTo('App\HistoryAttachment');
    }

    function State()
    {
       return $this->hasOne('App\State');
    }

    function Task()
    {
       return $this->belongsTo('App\Task');
    }

    function User()
    {
       return $this->hasOne('App\User');
    }

    function Priority()
    {
       return $this->hasOne('App\Priority');
    }

    function Project()
    {
       return $this->hasOne('App\Project');
    }

}