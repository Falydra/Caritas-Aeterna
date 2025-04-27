<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('books', function (Blueprint $table) {
            $table->string('isbn', 13)->primary();
            $table->string('title', 255);
            $table->json('authors');
            $table->string('published_year', 4);
            $table->text('synopsis')->nullable();
            $table->string('cover_image')->nullable();
            $table->unsignedInteger('price')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('books');
    }
};
