<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class FranzosMenuSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/menu.seed.json');
        $data = json_decode((string) file_get_contents($path), true);

        foreach ($data['categories'] ?? [] as $cat) {
            $category = Category::updateOrCreate(
                ['external_id' => $cat['id']],
                [
                    'name' => $cat['name'],
                    'slug' => $cat['slug'],
                    'sort_order' => $cat['sortOrder'] ?? 0,
                    'is_active' => true,
                ]
            );

            foreach ($cat['items'] ?? [] as $item) {
                MenuItem::updateOrCreate(
                    ['external_id' => $item['id']],
                    [
                        'category_id' => $category->id,
                        'name' => $item['name'],
                        'slug' => $item['slug'],
                        'description' => $item['description'] ?? null,
                        'price' => $item['price'],
                        'image' => $item['image'] ?? null,
                        'is_available' => $item['isAvailable'] ?? true,
                        'spice_selectable' => $item['spiceSelectable'] ?? false,
                        'meta' => isset($item['customizations']) ? ['customizations' => $item['customizations']] : null,
                    ]
                );
            }
        }
    }
}
