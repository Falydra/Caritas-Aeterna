<?php

use App\Enums\ProductStatusEnum;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('book_donation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donation_id')->constrained(
                table: 'donations', indexName: 'book_donation_donation_id'
            )->onDelete('cascade');
            $table->string('isbn', 13);
            $table->unsignedSmallInteger('amount');
            $table->enum(
                'status',
                array_column(ProductStatusEnum::cases(), 'value'))
                ->default(ProductStatusEnum::NOT_FULFILLED->value);
            $table->timestamps();

            $table->foreign('isbn')->references('isbn')->on('books')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('book_donation');
    }
};
