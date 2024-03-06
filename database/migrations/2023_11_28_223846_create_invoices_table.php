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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('no');
            $table->string('clientName')->nullable();
            $table->string('clientEmail')->nullable();
            $table->string('phone')->nullable();
            $table->date('dueTo')->nullable();

            $table->json('items')->nullable();
            $table->string('subtotal')->nullable();
            $table->string('markup')->nullable();
            $table->string('tax')->nullable();
            $table->string('discount')->nullable();
            $table->string('deposit')->nullable();
            $table->json('paymentSchedule')->nullable();
            $table->string('total')->nullable();

            $table->json('signature')->nullable();
            $table->string('description')->nullable();
            $table->string('homeownerFinance')->nullable();

            // estimate-pending: 1, estimate-approved: 2, estimate-declined: 3, invoice-active: 4, invoice-paid: 5
            $table->integer('state');
            
            $table->string('user')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
