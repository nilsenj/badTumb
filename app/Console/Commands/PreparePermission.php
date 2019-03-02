<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class PreparePermission extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'prepare:perms ';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Runs only the chmod on caching directories. Run if you get permission errors on view or other temporary directories.';

  /**
   * Create a new command instance.
   *
   * @return void
   */
  public function __construct()
  {
    parent::__construct();
  }


  /**
   * Execute the console command.
   *
   * @return mixed
   */
  public function handle()
  {

    // Kind of a hack to chmod without prompting.
    if (env('APP_ENV') == 'local') {
      if ($this->isMacOs()) {
        return $this->setUpMacOsPermissions();
      } else {
        // Ensure all writable directories are chmod-ed
        // NOTE: PHP chmod function NOT allowed here, so am using system call
        system("cd " . base_path() . " && sudo -S chmod 777 -R storage", $return_code);
        system("cd " . base_path() . " && sudo -S chown daemon:daemon -R storage", $return_code);

        if ($return_code != 0) {
          die("Unable to run chmod -R 777 storage. Aborting.");
        }

      }
    }
    //$this->comment("chmod ran successfully!");
  }

  /**
   *
   */
  private function setUpMacOsPermissions()
  {
    // Ensure all writable directories are chmod-ed
    // NOTE: PHP chmod function NOT allowed here, so am using system call
    system("cd " . base_path() . " && sudo -S chmod -R 777 storage", $return_code);
    system("cd " . base_path() . ' && sudo -S chown -R $USER:_www storage', $return_code);

    if ($return_code != 0) {
      die("Unable to run chmod -R 777 storage. Aborting.");
    }
  }

  /**
   * @return bool
   */
  private function isMacOs()
  {
    if (strtoupper(substr(PHP_OS, 0, 3)) == "DAR") {
      return true;
    } else {
      return false;
    }
  }
}
