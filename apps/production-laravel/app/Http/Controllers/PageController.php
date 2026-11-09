<?php

namespace App\Http\Controllers;

use App\Support\Copy;

class PageController extends Controller
{
    public function about()
    {
        return view('pages.about', ['copy' => Copy::all(), 'franzos' => config('franzos')]);
    }

    public function contact()
    {
        return view('pages.contact', ['franzos' => config('franzos')]);
    }

    public function openingHours()
    {
        return view('pages.opening-hours', ['franzos' => config('franzos')]);
    }
}
