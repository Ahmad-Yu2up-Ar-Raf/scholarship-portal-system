<?php

namespace App\Enums;

enum ScholarshipType: string
{
    case ACADEMIC = 'academic';
    case NON_ACADEMIC = 'non_academic';
    case SPORTS = 'sports';
    case ARTS = 'arts';
    case TECHNOLOGY = 'technology';

    public function label(): string
    {
        return match ($this) {
            self::ACADEMIC => 'Akademik',
            self::NON_ACADEMIC => 'Non-Akademik',
            self::SPORTS => 'Olahraga',
            self::ARTS => 'Seni & Budaya',
            self::TECHNOLOGY => 'Sains & Teknologi',
        };
    }
}
