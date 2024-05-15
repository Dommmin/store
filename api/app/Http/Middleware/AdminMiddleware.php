<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated and has is_admin set to true
        if ($request->user() && $request->user()->isAdmin()) {
            // Proceed with the request
            return $next($request);
        }

        // Redirect or handle unauthorized access
        return response('You don\'t have permission to access this page.', 403);
    }
}
