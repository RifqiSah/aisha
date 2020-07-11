import Jimp from 'jimp';

export default class Image {
    static async renderImage(url: string, x = 0, y = 0, height = 0, width = 0): Promise<Jimp> {
        const image = await Jimp.read(url);

        if (x && y && height && width) {
            image.crop(x, y, height, width);
        }

        return image;
    }

    static async renderImageComposite(image1: Jimp, image2: Jimp): Promise<Buffer> {
        image2.composite(image1, 0, 0);
        return await image2.getBufferAsync(Jimp.MIME_PNG);
    }
}