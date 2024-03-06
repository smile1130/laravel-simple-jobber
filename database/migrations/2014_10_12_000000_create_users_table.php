<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('industry')->default("General Contracting");
            $table->rememberToken();

            $table->string('avatar')->nullable();
            $table->string('description')->nullable();
            $table->string('currency')->nullable();
            $table->string('locale')->nullable();
            $table->string('companyName')->nullable();
            $table->string('companyPhone')->nullable();
            $table->string('companyAddress1')->nullable();
            $table->string('companyAddress2')->nullable();
            $table->string('companyCity')->nullable();
            $table->string('companyState')->nullable();
            $table->string('companyZip')->nullable();
            $table->string('companyCountry')->nullable();
            $table->string('companyEmail')->nullable();
            $table->string('companyPhone2')->nullable();
            $table->string('companyFax')->nullable();
            $table->string('companyWebsite')->nullable();

            $table->string('estimateMsg')->default("We are excited about the possibility of working with you.");
            $table->string('invoiceMsg')->default("Thanks for your business!");

            $table->string("role")->default("User");

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
