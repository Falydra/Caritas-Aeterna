<?php

namespace App\Services;

use Intervention\Image\EncodedImage;
use Intervention\Image\ImageManager;
// use Intervention\Image\Drivers\Imagick\Driver;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageService {
    /**
     * Store Image then return the filepath
     *
     * @return string
     */
    public function storeImage(
        string $title,
        UploadedFile $file,
        string $storePath,
        string &$filepath
    ) {
        // create the store directory
        Storage::disk('public')->makeDirectory($storePath);

        // hash the name
        $filename = md5_file($file->getRealPath());

        // encode and store
        $image = $this->EncodeWebp($file);
        $storePath = $storePath . '/' . $filename . '.webp';
        Storage::disk('public')->put($storePath, (string) $image);

        // retrieve the filepath
        $filepath = Storage::url($storePath);
    }

    /**
     * Convert image to webp
     *
     * @return EncodedImage
     */
    public function EncodeWebp(UploadedFile $file): EncodedImage {
        $manager = new ImageManager(new Driver());
        $image = $manager->read($file);
        $encoded = $image->toWebp(60);
        return $encoded;
    }
}
