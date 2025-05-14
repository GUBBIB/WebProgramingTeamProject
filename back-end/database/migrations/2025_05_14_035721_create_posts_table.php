<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id('PST_id'); // 기본키

            $table->unsignedBigInteger('BRD_id'); // boards 테이블 외래키
            $table->unsignedBigInteger('USR_id'); // users 테이블 외래키

            $table->text('PST_title');
            $table->text('PST_content');

            $table->timestamps(); // created_at, updated_at 자동 생성 및 관리

            $table->integer('PST_front_page')->nullable();
            $table->integer('PST_behind_page')->nullable();

            // 외래 키 제약 조건
            $table->foreign('BRD_id')->references('BRD_id')->on('boards')->onDelete('cascade');
            $table->foreign('USR_id')->references('USR_id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
