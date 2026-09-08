<?php

namespace App\Http\Controllers;

use Illuminate\Pagination\LengthAwarePaginator;

abstract class Controller
{
    /**
     * Return a standardized paginated response.
     */
    public function respondWithPagination(
        LengthAwarePaginator $paginator,
        string $message = 'Data retrieved successfully',
        array $filters = []
    ): array
    {
        return [
            'status' => true,
            'message' => $message,
            'data' => $paginator->items(),
            'meta' => [
                'filters' => $filters,
                'pagination' => [
                    'total' => $paginator->total(),
                    'currentPage' => $paginator->currentPage(),
                    'perPage' => $paginator->perPage(),
                    'lastPage' => $paginator->lastPage(),
                    'hasMore' => $paginator->currentPage() < $paginator->lastPage(),
                ],
            ],
        ];
    }
}
