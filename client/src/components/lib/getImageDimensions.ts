interface ImageDimensions {
  width: number;
  height: number;
}

export default function getImageDimensions(
  url: string,
): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = () => reject(new Error("Error loading image"));
    img.src = url;
  });
}
