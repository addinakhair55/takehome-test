<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        if ($request->user()->role !== $role) {
            return response()->json(['message' => 'Forbidden: Only ' . $role . ' can access this'], 403);
        }
        return $next($request);
    }
}
