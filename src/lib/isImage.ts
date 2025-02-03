export default function isImage(fileName: string): boolean {
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileName);
}
