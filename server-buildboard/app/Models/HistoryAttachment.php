<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HistoryAttachment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       'history_attachment_file_type','history_attachment_file_name','history_attachment_file',
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

}