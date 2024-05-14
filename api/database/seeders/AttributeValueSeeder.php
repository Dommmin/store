<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Database\Seeder;

class AttributeValueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colorValues = [
            'red',
            'green',
            'blue',
            'yellow',
            'orange',
            'purple',
            'black',
            'white',
            'brown',
            'gray',
        ];

        $color = Attribute::whereName('color')->firstOrCreate();

        foreach ($colorValues as $colorValue) {
            AttributeValue::factory()->create([
                'attribute_id' => $color->id,
                'name' => $colorValue,
            ]);
        }

        $storageValues = [
            '128GB',
            '256GB',
            '512GB',
            '1TB',
            '2TB',
            '4TB',
            '8TB',
            '16TB',
        ];

        $storage = Attribute::whereName('storage')->firstOrCreate();

        foreach ($storageValues as $storageValue) {
            AttributeValue::factory()->create([
                'attribute_id' => $storage->id,
                'name' => $storageValue,
            ]);
        }

        $memoryValues = [
            '4GB',
            '8GB',
            '16GB',
            '32GB',
            '64GB',
            '128GB',
        ];

        $memory = Attribute::whereName('memory')->firstOrCreate();

        foreach ($memoryValues as $memoryValue) {
            AttributeValue::factory()->create([
                'attribute_id' => $memory->id,
                'name' => $memoryValue,
            ]);
        }

        $screenSizeValues = [
            '13',
            '14',
            '15',
            '16',
            '17',
        ];

        $screenSize = Attribute::whereName('screen size')->firstOrCreate();

        foreach ($screenSizeValues as $screenSizeValue) {
            AttributeValue::factory()->create([
                'attribute_id' => $screenSize->id,
                'name' => $screenSizeValue,
            ]);
        }
    }
}
