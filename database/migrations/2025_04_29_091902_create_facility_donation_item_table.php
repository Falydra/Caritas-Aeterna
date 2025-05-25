<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('facility_donation_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donation_item_id')->constrained(
                "donation_items",
                "id"
            )->cascadeOnDelete();
            $table->foreignId('facility_id')->constrained(
                "facilities",
                "id"
            )->cascadeOnDelete();
            $table->unsignedSmallInteger('amount')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('facility_donation_item');
    }
};
