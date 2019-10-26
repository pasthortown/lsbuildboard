<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTaskStatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('task_states', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->dateTime('date_time')->nullable($value = true);
          $table->longText('comment')->nullable($value = true);
          $table->unsignedInteger('task_id');
          $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
          $table->unsignedInteger('state_id');
          $table->foreign('state_id')->references('id')->on('states')->onDelete('cascade');
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
       Schema::dropIfExists('task_states');
    }
}