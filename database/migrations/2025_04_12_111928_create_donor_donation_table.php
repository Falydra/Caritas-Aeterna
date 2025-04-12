<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('donor_donation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donor_id')->constrained(
                table: 'users', indexName: 'donor_donation_donor_id'
            )->cascadeOnDelete();
            $table->foreignId('donation_id')->constrained(
                table: 'donations', indexName: 'donor_donation_donation_id'
            )->cascadeOnDelete();
            $table->timestamp('verified_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('donor_donation');
    }
};
