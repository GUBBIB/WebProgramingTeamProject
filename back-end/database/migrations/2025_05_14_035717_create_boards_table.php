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
        Schema::create('boards', function (Blueprint $table) {
            $table->id('BRD_id');
            $table->string('BRD_name')->unique();
            $table->timestamps();
        });

        DB::table('boards')->insert([
            ['BRD_name' => '전체', 'created_at' => now(), 'updated_at' => now()],
            ['BRD_name' => '자유 게시판', 'created_at' => now(), 'updated_at' => now()],
            ['BRD_name' => '코드 게시판', 'created_at' => now(), 'updated_at' => now()],
            ['BRD_name' => '질문 게시판', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boards');
    }
};
