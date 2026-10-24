<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ProjectSeeder extends Seeder
{
    /**
     * Seed the projects currently shown on the portfolio.
     * Images are copied from database/seeders/images to storage/app/public/works.
     */
    public function run(): void
    {
        $projects = [
            [
                'slug' => 'roller-coaster-manager',
                'title' => 'Roller Coaster Manager',
                'category' => 'Course Project',
                'type' => 'fullStack',
                'description' => 'A management app for Walibi roller coasters. View all attractions, sort them by category, and log breakdowns to keep operations running smoothly.',
                'tools' => ['Vue.js', 'Kotlin', 'Spring Boot'],
                'image' => 'roller-coaster-manager.png',
                'alt' => 'Roller Coaster Manager app overview',
            ],
            [
                'slug' => 'cali-brussels',
                'title' => 'Cali Brussels',
                'category' => 'Course Project',
                'type' => 'fullStack',
                'description' => 'Cali Brussels is a web platform that shows calisthenics parks in Brussels on an interactive map. Users can search for parks, filter by location or equipment, and view or add reviews.',
                'tools' => ['Figma', 'Illustrator', 'Javascript', 'Node.js', 'Html | css'],
                'image' => 'cali-brussels.png',
                'alt' => 'Cali Brussels app overview',
            ],
            [
                'slug' => 'ing-arena',
                'title' => 'ING arena',
                'category' => 'School Assignment',
                'type' => 'frontEnd',
                'description' => 'ING Arena was a project for my Web & Mobile course in the final year of my degree. For the “I Love Brussels” assignment, I chose a place in Brussels that I love and built a website around it. I also had to learn a new technology, so I chose TypeScript and React.',
                'tools' => ['Typescript', 'React.js'],
                'image' => 'ing-arena.png',
                'alt' => 'Screenshot of the ILoveBrussels assignment',
            ],
            [
                'slug' => 'tankcalc',
                'title' => 'TankCalc',
                'category' => 'Personal Project',
                'type' => 'frontEnd',
                'description' => 'Interactive route calculator that estimates fuel costs, consumption, stops, return trips, and safety information through a map interface. Users can add stops through search or map clicks, save routes, and reload them later from a modal overview.',
                'tools' => ['React.js', 'React-Leaflet'],
                'image' => 'tankcalc.png',
                'alt' => 'Screenshot of TankCalc with an interactive map of Europe, route settings, and saved routes in an organized modal.',
            ],
            [
                'slug' => 'polish-institute-brussels',
                'title' => 'Polish Institute in Brussels',
                'category' => 'Client Work',
                'type' => 'frontEnd',
                'description' => 'Full redesign of the old website for the Polish Institute Brussels, starting with a Figma design and later developed into a website after consultations.',
                'tools' => ['Javascript', 'Html | css', 'Figma', 'Photoshop'],
                'image' => 'polish-institute-brussels.png',
                'alt' => 'Polska szkola website overview',
            ],
            [
                'slug' => 'director-dna',
                'title' => 'Director DNA',
                'category' => 'Course Project',
                'type' => 'backEnd',
                'description' => 'A Laravel backend project about film directors where users can discover, filter, and compare directors. The app includes database relationships between directors, films, genres, style tags, and users, with admin CRUD functionality, authentication, favorites, and a Director DNA comparison based on filmography, genres, style, and IMDb scores.',
                'tools' => ['Laravel', 'PHP', 'Blade', 'SQLite'],
                'image' => 'director-dna.png',
                'alt' => 'Director DNA logo for a backend project about managing and comparing film directors.',
            ],
            [
                'slug' => 'hidden-shanghai',
                'title' => 'Hidden Shanghai',
                'category' => 'Course Project',
                'type' => 'backEnd',
                'description' => 'A backend application that uncovers hidden gems and lesser-known locations across Shanghai, serving location data and user-submitted spots through a Laravel API.',
                'tools' => ['Laravel', 'PHP'],
                'image' => 'hidden-shanghai.png',
                'alt' => 'Hidden Shanghai app overview',
            ],
            [
                'slug' => 'recycle-app',
                'title' => 'Recycle App',
                'category' => 'Personal Project',
                'type' => 'frontEnd',
                'description' => 'Recycling app that provides information about waste collection schedules and offers simple advice on how to sort waste correctly.',
                'tools' => ['React.js', 'Typescript'],
                'image' => 'recycle-app.png',
                'alt' => 'Recyclage App overview',
            ],
            [
                'slug' => 'waste-watch',
                'title' => 'Waste Watch',
                'category' => 'Group Project',
                'type' => 'fullStack',
                'description' => 'WasteWatch is an app that helps users track and understand their waste habits, providing insights and simple tips to reduce waste.',
                'tools' => ['Javascript', 'Node.js', 'Figma', 'Photoshop', 'Illustrator', 'Html | css'],
                'image' => 'waste-watch.png',
                'alt' => 'Waste Watch app overview',
            ],
        ];

        foreach ($projects as $index => $project) {
            $image = 'works/'.$project['image'];
            Storage::disk('public')->put($image, file_get_contents(database_path('seeders/images/'.$project['image'])));

            Project::updateOrCreate(
                ['slug' => $project['slug']],
                [...$project, 'image' => $image, 'position' => $index + 1],
            );
        }
    }
}
