<?php

use App\Enums\ProductStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_donation_id')->constrained(
                table:'donations', indexName:'facility_product_donation_id'
            );
            $table->string('name', 255);
            $table->string('description', 255);
            $table->string('dimension')->nullable();
            $table->string('material')->nullable();
            $table->unsignedInteger('price');
            $table->unsignedSmallInteger('amount');
            $table->enum(
                'status',
                array_column(ProductStatusEnum::cases(), 'value'))
                ->default(ProductStatusEnum::NOT_FULFILLED->value);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('facilities');
    }
};
