<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Contracts\Http\Kernel as HttpKernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class DevPostman extends Command {

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dev:postman {guard} {user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generating access for postman';

    /**
     * Execute the console command.
     */
    public function handle() {
        if (!App::environment('local')) {
            $this->warn("It works only on local environment");
            return 1;
        }

        if (!User::query()->count()) {
            $this->warn("Users table is empty");
            return 1;
        }

        $user = $this->argument('user')
            ? User::query()->findOrFail($this->argument('user'))
            : User::query()->firstOrFail()
        ;

        if ($this->argument('guard') === "api") {
            $this->output->writeln($user->createToken('test')->plainTextToken);
            return 0;
        }

        Route::get('/dev-login', function () use ($user) {
            Auth::login($user);
            return response("Hello mevelix.");
        })->middleware('web');

        $request = Request::create('/dev-login');
        $kernel = app()->make(HttpKernel::class);
        $response = $kernel->handle($request);
        $cookies = $response->headers->getCookies('array');
        $cookie1 = $cookies[""]["/"]['laravel_session'];
        $cookie2 = $cookies[""]["/"]['XSRF-TOKEN'];
        $laravelSession = $cookie1->getValue();
        $xsrfToken = $cookie2->getValue();

        $result = '
            pm.request.addHeader({key: "Cookie", value: "laravel_session='.$laravelSession.'"});
            pm.request.addHeader({key: "X-XSRF-TOKEN", value: "'.$xsrfToken.'"});
        ';

        $this->output->writeln($result);
        return 0;
    }
}
