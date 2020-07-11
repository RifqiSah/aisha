import Jimp from 'jimp';

export default class Image {
    static async renderImage(url: string, x?: number, y?: number, height?: number, width?: number): Promise<Jimp> {
        const image = await Jimp.read(url);

        if (x !== undefined && y !== undefined && height !== undefined && width !== undefined) {
            image.crop(x, y, height, width);
        }

        return image;
    }

    static async renderImageComposite(image1: Jimp, image2: Jimp): Promise<Buffer> {
        image2.composite(image1, 0, 0);
        return await image2.getBufferAsync(Jimp.MIME_PNG);
    }
}