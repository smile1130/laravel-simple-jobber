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
        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->string("title")->default("");
            $table->integer("customerPermission")->default(0);
            $table->integer("itemPermission")->default(0);
            $table->integer("invoicePermission")->default(0);
            $table->integer("estimatePermission")->default(0);
            $table->integer("userPermission")->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
    }
};
