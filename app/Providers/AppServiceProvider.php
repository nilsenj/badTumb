<?php

namespace App\Providers;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
  /**
   * Bootstrap any application services.
   *
   * @return void
   */
  public function boot()
  {
    Schema::defaultStringLength(255);
    Builder::macro('whereLike', function($attributes, string $searchTerm) {
      foreach(array_wrap($attributes) as $attribute) {
        $this->orWhere($attribute, 'LIKE', "%{$searchTerm}%");
      }

      return $this;
    });
  }

  /**
   * Register any application services.
   *
   * @return void
   */
  public function register()
  {
    //
  }
}
