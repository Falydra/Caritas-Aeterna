<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('funds', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique()->nullable();
            $table->foreignId('donation_id')->constrained(
                'donations',
                'id',
                'fund_donation_id'
            );
            $table->foreignId('donor_donation_id')->constrained(
                'donor_donation',
                'id',
                'fund_donor_donation_id'
            );
            $table->string('donation_type')->nullable();
            $table->decimal('amount', 20, 2)->default(5000);
            $table->string('status')->default('pending');
            $table->string('snap_token', 36)->nullable();
            $table->string('redirect_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('funds');
    }
};
