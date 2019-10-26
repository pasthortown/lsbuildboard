<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('project_attachments', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->string('project_attachment_file_type',50)->nullable($value = true);
          $table->string('project_attachment_file_name',50)->nullable($value = true);
          $table->longText('project_attachment_file')->nullable($value = true);
          $table->unsignedInteger('project_id');
          $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::dropIfExists('project_attachments');
    }
}