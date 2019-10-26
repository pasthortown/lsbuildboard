<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTaskAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('task_attachments', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->string('task_attachment_file_type',50)->nullable($value = true);
          $table->string('task_attachment_file_name',50)->nullable($value = true);
          $table->longText('task_attachment_file')->nullable($value = true);
          $table->unsignedInteger('task_id');
          $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::dropIfExists('task_attachments');
    }
}