<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;

class ProjectController extends Controller
{
    /**
     * GET /api/projects
     */
    public function index()
    {
        return ProjectResource::collection(Project::orderBy('position')->get());
    }

    /**
     * GET /api/projects/{slug}
     */
    public function show(Project $project)
    {
        return new ProjectResource($project);
    }
}
