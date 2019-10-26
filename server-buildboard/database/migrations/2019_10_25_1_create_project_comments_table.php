<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('project_comments', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->string('description',0)->nullable($value = true);
          $table->unsignedInteger('project_id');
          $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
          $table->unsignedInteger('user_id');
          $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::dropIfExists('project_comments');
    }
}