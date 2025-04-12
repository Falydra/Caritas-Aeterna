<?php

use App\Enums\GenderEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained(
                table: 'users', indexName: 'user_profile_user_id'
            )->onDelete('cascade');
            $table->string('full_name', 128);
            $table->string('phone_number', 15)->nullable();
            $table->date('date_of_birth');
            $table->enum(
                'gender',
                array_column(GenderEnum::cases(), 'value'))
                ->default(GenderEnum::NULL->value)->nullable();
            $table->string('profile_picture')->nullable();
            $table->timestamp('last_updated');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('user_profiles');
    }
};
