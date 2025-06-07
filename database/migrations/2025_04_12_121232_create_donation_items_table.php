<?php

use App\Enums\DonationItemStatusEnum;
use App\Enums\ProductStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('donation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donor_donation_id')->constrained(
                table: 'donor_donation', indexName: 'donation_item_donor_donation_id'
            )->cascadeOnDelete();
            $table->unsignedSmallInteger('product_amount')->default(0);
            $table->string('package_picture');
            $table->string('resi');
            $table->enum(
                'status',
                array_column(DonationItemStatusEnum::cases(), 'value'))
                ->default(DonationItemStatusEnum::PENDING->value);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('donation_items');
    }
};
