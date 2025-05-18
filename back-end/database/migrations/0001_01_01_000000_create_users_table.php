<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_create_users_table.php
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('USR_id'); // primary key
            $table->string('USR_email')->unique();
            $table->string('USR_pass');
            $table->string('USR_nickname')->nullable();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
