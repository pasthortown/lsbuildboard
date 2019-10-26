<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       'name','description','start_date','dod_date','dor_date',
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
       return $this->belongsTo('App\History');
    }

    function ProjectAttachment()
    {
       return $this->belongsTo('App\ProjectAttachment');
    }

    function ProjectComment()
    {
       return $this->belongsTo('App\ProjectComment');
    }

}