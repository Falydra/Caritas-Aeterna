<?php

use App\Enums\DoneeApplicationStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('donee_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained(
                table: 'users', indexName: 'donee_application_user_id'
            )->onDelete('cascade');
            $table->enum(
                'status',
                array_column(DoneeApplicationStatusEnum::cases(), 'value'))
                ->default(DoneeApplicationStatusEnum::PENDING->value);
            $table->foreignId('reviewed_by')->constrained(
                table: 'users', indexName: 'donee_application_reviewed_by_user_id'
            )->onDelete('cascade');
            $table->timestamp('reviewed_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('donee_applications');
    }
};
