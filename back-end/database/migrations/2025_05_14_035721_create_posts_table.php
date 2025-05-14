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
    Schema::create('posts', function (Blueprint $table) {
        $table->id('PST_id');
        $table->unsignedBigInteger('BRD_id');
        $table->unsignedBigInteger('USR_id');
        $table->string('PST_title');
        $table->text('PST_content');
        $table->timestamps(); // created_at, updated_at

        $table->foreign('BRD_id')->references('BRD_id')->on('boards')->onDelete('cascade');
        $table->foreign('USR_id')->references('USR_id')->on('users')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
