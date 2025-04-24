<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Donee;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

class DonationApiTest extends TestCase {
    /**
     * A basic feature test example.
     */
    public function test_can_create_donation_as_donee(): void {
        $user = Donee::first();

        $header_path = storage_path('app\\public\\uploads\\test\\header_01.png');
        $header_name = 'header_01.png';
        $header_file = new UploadedFile(
            $header_path,
            $header_name,
            'image/png',
            null,
            true
        );

        $text_descriptions = [
            '0' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin pretium neque, sit amet maximus orci ultrices quis. Vivamus nisi nisl, ultricies in ex id, lobortis pellentesque enim. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur fringilla turpis id lectus elementum, sit amet mollis nisl interdum. Nunc eu semper odio, eu fringilla nulla. Cras condimentum dui orci, et commodo nunc vehicula semper. Nullam vel lectus ligula. Donec eu ultricies nulla, sed suscipit velit. Duis suscipit volutpat ex, ultrices sagittis augue aliquet eget. Mauris arcu nunc, varius non aliquam eu, placerat sit amet neque. Cras aliquam leo magna, ut auctor enim consectetur sit amet. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
            '1' => 'Phasellus nisl metus, ullamcorper ut enim nec, gravida interdum tellus. Nunc non risus vitae mi facilisis tincidunt luctus eu diam. Praesent a ultricies purus. Etiam porta risus sit amet sem gravida tincidunt. Integer et velit vel elit vulputate molestie quis nec erat. Fusce in nunc magna. Donec pharetra velit nec aliquam consequat.',
            '3' => 'Nam quis lobortis odio. Maecenas mollis nunc nec ante mattis pellentesque. Maecenas commodo interdum facilisis. Nunc sed enim tempus, pulvinar nulla nec, posuere ante. Donec ultricies dolor quis ex finibus, facilisis malesuada nunc vulputate. Nam at tellus mauris. Sed justo nunc, ultrices ut finibus condimentum, imperdiet ut erat. Aenean quis sapien porta orci dictum pretium at ut mauris. Etiam dapibus diam ex, in suscipit risus laoreet sed. Pellentesque vel ultricies tellus, porta sodales leo.'
        ];

        $images = [
            '2' => 'desc_01.png',
            '4' => 'desc_02.png'
        ];
        $image_descriptions = [];
        $this->populateImageDescriptions($images, $image_descriptions);


        $response = $this->actingAs($user)->postJson(
            'donations',
            [
                'data' => [
                    "type" => "product_donations",
                    "title" => "buku untuk pai",
                    "type_attributes" => [
                        "product_amount" => 15,
                        "fulfilled_product_amount" => 0
                    ],
                    "header_image" => $header_file,
                    "text_descriptions" => $text_descriptions,
                    "image_descriptions" => $image_descriptions
                ]
            ]
        );
        $response->assertStatus(302);
    }

    private function populateImageDescriptions(array $images, array &$image_descriptions) {
        foreach ($images as $index => $name) {
            $img_path = storage_path('app\\public\\uploads\\test\\' . $name);
            $img_file = new UploadedFile(
                $img_path,
                $name,
                'image/jpg',
                null,
                true
            );
            $image_descriptions += [$index => $img_file];
        }
    }
}
