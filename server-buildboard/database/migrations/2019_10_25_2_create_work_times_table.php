<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorkTimesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('work_times', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->dateTime('start')->nullable($value = true);
          $table->dateTime('end')->nullable($value = true);
          $table->unsignedInteger('task_id');
          $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
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
       Schema::dropIfExists('work_times');
    }
}