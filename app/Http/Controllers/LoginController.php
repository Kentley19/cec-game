<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\LoginBacklog;
class LoginController extends Controller
{ 
    public function loginTeacherView(){
         return view("Teacher.Login");
    }
    public function dashboard(){

        if(Auth::user()){

            return view("Teacher.Dashboard");
        }else{
            
         return view("Teacher.Login");
        }
    }
    
    public function loginTeacher(Request $request)
    {
        $credentials = $request->validate([
            'school_id' => ['required'], // Validate school_id instead of email
            'psw' => ['required'],
        ]);

        // Attempt authentication using school_id and password
        if (Auth::attempt(['school_id' => $credentials['school_id'], 'password' => $credentials['psw']])) {
            $request->session()->regenerate(); // Prevent session fixation attacks

            // Redirect to dashboard with user data
            return redirect()->route('dashboard')->with('user', Auth::user());
        }

        // Authentication failed
        return back()->withErrors([
    'school_id' => 'The provided school ID or password is incorrect.',
    ])->withInput(); // `withInput()` preserves the old input data
    
    }
    public function login(Request $request)
    {
        $request->validate([
            'school_id' => 'required',
            'password' => 'required',
        ]);

        // Find the user by school_id
        $user = User::where('school_id', $request->school_id)->first();
         LoginBacklog::create([
            'school_id' =>  $request->school_id, 
            'login_time' =>  now(), 
        ]);
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Generate a token or session for the user
        // Example: Assuming you use a simple token
        $token = bin2hex(random_bytes(32)); // Generate a random token
        $user->remember_token = $token; // Save token to user record
        $user->save();

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'fname' => $user->fname,
                'mname' => $user->mname,
                'lname' => $user->lname,
                'school_id' => $user->school_id,
                'type' => $user->type,
            ],
            'token' => $token,
        ]);
    }

}
