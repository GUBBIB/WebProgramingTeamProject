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
        Schema::create('comments', function (Blueprint $table) {
            $table->id('COM_id'); // 기본키

            $table->unsignedBigInteger('USR_id'); // 외래키: users
            $table->unsignedBigInteger('PST_id'); // 외래키: posts

            $table->text('COM_content'); // 댓글 내용

            $table->timestamps(); // created_at, updated_at 자동 관리

            // 외래키 제약조건
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
