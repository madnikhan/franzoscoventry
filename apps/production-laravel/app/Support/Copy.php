<?php

namespace App\Support;

class Copy
{
  /** @var array<string, string>|null */
  private static ?array $data = null;

  /** @return array<string, string> */
  public static function all(): array
    {
        if (self::$data === null) {
            $path = storage_path('app/shared/copy.json');
            self::$data = json_decode((string) file_get_contents($path), true) ?? [];
        }

        return self::$data;
    }

    public static function get(string $key, string $default = ''): string
    {
        return (string) (self::all()[$key] ?? $default);
    }
}
