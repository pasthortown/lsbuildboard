<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProjectAttachment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       'project_attachment_file_type','project_attachment_file_name','project_attachment_file',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
       
    ];

    function Project()
    {
       return $this->hasOne('App\Project');
    }

}