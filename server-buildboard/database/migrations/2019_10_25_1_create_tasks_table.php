<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('tasks', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->string('title',255)->nullable($value = true);
          $table->longText('description')->nullable($value = true);
          $table->time('time_expected')->nullable($value = true);
          $table->unsignedInteger('history_id');
          $table->foreign('history_id')->references('id')->on('histories')->onDelete('cascade');
          $table->unsignedInteger('user_id');
          $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
          $table->unsignedInteger('priority_id');
          $table->foreign('priority_id')->references('id')->on('priorities')->onDelete('cascade');
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::dropIfExists('tasks');
    }
}