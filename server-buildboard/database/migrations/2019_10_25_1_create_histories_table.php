<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('histories', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->longText('description')->nullable($value = true);
          $table->string('source',255)->nullable($value = true);
          $table->dateTime('dod_date_time')->nullable($value = true);
          $table->dateTime('dor_date_time')->nullable($value = true);
          $table->unsignedInteger('state_id');
          $table->foreign('state_id')->references('id')->on('states')->onDelete('cascade');
          $table->unsignedInteger('user_id');
          $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
          $table->unsignedInteger('priority_id');
          $table->foreign('priority_id')->references('id')->on('priorities')->onDelete('cascade');
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
       Schema::dropIfExists('histories');
    }
}