<?php

namespace Leantony\Modal;

use Illuminate\Support\ServiceProvider as LaravelServiceProvider;

class ServiceProvider extends LaravelServiceProvider
{
    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadViewsFrom(__DIR__ . '/resources/views', 'modal');

        $this->publishes([
            __DIR__ . '/resources/views' => base_path('resources/views/vendor/leantony/modal'),
            __DIR__ . '/resources/js' => base_path('resources/assets/vendor/leantony/modal'),
        ]);

        $this->publishes([
            __DIR__ . '/resources/js' => public_path('vendor/leantony/modal'),
        ], 'public');
    }
}