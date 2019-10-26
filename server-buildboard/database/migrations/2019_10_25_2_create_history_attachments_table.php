<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHistoryAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('history_attachments', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->string('history_attachment_file_type',50)->nullable($value = true);
          $table->string('history_attachment_file_name',255)->nullable($value = true);
          $table->longText('history_attachment_file')->nullable($value = true);
          $table->unsignedInteger('history_id');
          $table->foreign('history_id')->references('id')->on('histories')->onDelete('cascade');
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::dropIfExists('history_attachments');
    }
}