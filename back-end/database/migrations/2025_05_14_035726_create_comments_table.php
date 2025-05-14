<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('comment', function (Blueprint $table) {
        $table->id('COM_id');
        $table->unsignedBigInteger('USR_id');
        $table->unsignedBigInteger('PST_id');
        $table->text('COM_content');
        $table->date('COM_createDay');

        $table->foreign('USR_id')->references('USR_id')->on('users')->onDelete('cascade');
        $table->foreign('PST_id')->references('PST_id')->on('posts')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
