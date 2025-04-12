<?php

use App\Enums\DonationStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('initiator_id')->constrained(
                table: 'users', indexName: 'donation_user_id',
            )->onDelete('cascade');
            $table->string('type');
            $table->json('type_attributes');
            $table->string('title', 128);
            $table->string('description');
            $table->string('header_image');
            $table->enum(
                'status',
                array_column(DonationStatusEnum::cases(), 'value'))
                ->default(DonationStatusEnum::PENDING->value);
            $table->foreignId('reviewed_by')->nullable()->default(null)
                ->constrained(
                    table: 'users', indexName: 'donation_reviewed_by_user_id'
                )->onDelete('cascade');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('donations');
    }
};
