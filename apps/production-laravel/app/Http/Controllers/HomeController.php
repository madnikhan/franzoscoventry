<?php

namespace App\Http\Controllers;

use App\Support\Copy;

class HomeController extends Controller
{
    public function index()
    {
        return view('home', ['copy' => Copy::all()]);
    }
}
