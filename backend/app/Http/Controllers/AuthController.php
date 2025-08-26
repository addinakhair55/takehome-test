<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $otp = rand(100000, 999999);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'otp_code' => $otp,
            'otp_expires_at' => Carbon::now()->addMinutes(10), 
        ]);

        try {
            Mail::raw("Your verification code is: $otp (valid for 10 minutes)", function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('Email Verification - OTP');
            });
            return response()->json(['message' => 'User created successfully. OTP sent to email.'], 201);
        } catch (\Exception $e) {
            $user->delete();
            return response()->json([
                'message' => 'Failed to send OTP email. Registration cancelled.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp_code' => 'required|digits:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->otp_code !== $request->otp_code) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        if (Carbon::now()->gt($user->otp_expires_at)) {
            return response()->json(['message' => 'OTP expired'], 400);
        }

        $user->email_verified_at = Carbon::now();
        $user->otp_code = null;
        $user->otp_expires_at = null;
        $user->save();

        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'message' => 'Email verified successfully!',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string|min:6'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!$user->email_verified_at) {
            return response()->json(['message' => 'Email not verified. Please verify with OTP.'], 403);
        }

        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,'.$user->id,
        ]);

        $user->update($request->only('name', 'email'));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string|min:6',
            'new_password' => 'required|string|min:8|confirmed', 
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json(['message' => 'Password changed successfully']);
    }
}
