<?php

namespace App\Http\Controllers;

use App\Http\Resources\ScholarshipResource;
use App\Models\Scholarship;
use Illuminate\Http\JsonResponse;

class ScholarshipController extends Controller
{
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $query = Scholarship::query()->withCount('beasiswas');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        $query->orderByDesc('beasiswas_count')->orderBy('name');

        $perPage = max(1, min(50, (int) $request->query('per_page', 50)));
        $paginated = $query->paginate($perPage);

        return response()->json([
            'data' => ScholarshipResource::collection($paginated->items()),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'last_page' => $paginated->lastPage(),
            ],
        ]);
    }

    public function show(Scholarship $scholarship): JsonResponse
    {
        return response()->json([
            'data' => new ScholarshipResource($scholarship),
        ]);
    }
}
