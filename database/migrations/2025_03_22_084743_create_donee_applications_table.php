<?php

use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('donee_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained(User::class)->onDelete('cascade');
            $table->unsignedTinyInteger('status');
            $table->foreignId('approved_by')->constrained(User::class)->onDelete('cascade');
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
