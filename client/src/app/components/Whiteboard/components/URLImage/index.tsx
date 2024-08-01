import useImage from "use-image";
import { TImage } from "../../types";
import { useEffect, useRef } from "react";
import Konva from "konva";
import { Image, Transformer } from "react-konva";

export default function URLImage({
  data,
  onTransform,
}: {
  data: TImage;
  onTransform: (data: TImage) => void;
}) {
  const [image] = useImage(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}${data.src}`,
  );
  console.log(`${process.env.NEXT_PUBLIC_SERVER_API_URL}${data.src}`);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [image]);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.setAttrs({
        x: data.position.x,
        y: data.position.y,
        width: data.size.width,
        height: data.size.height,
        rotation: data.rotation || 0,
        scaleX: data.scale?.x || 1,
        scaleY: data.scale?.y || 1,
      });
    }
  }, [data]);

  return (
    <>
      <Image
        image={image}
        ref={imageRef}
        alt={"uploaded image"}
        draggable
        onDragEnd={(e) => {
          const node = imageRef.current!;
          onTransform({
            ...data,
            position: { x: node.x(), y: node.y() },
          });
        }}
        onTransformEnd={() => {
          const node = imageRef.current!;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onTransform({
            ...data,
            position: { x: node.x(), y: node.y() },
            size: {
              width: node.width() * scaleX,
              height: node.height() * scaleY,
            },
            rotation: node.rotation(),
            scale: { x: scaleX, y: scaleY },
          });
        }}
        onClick={() => {
          if (trRef.current && imageRef.current) {
            trRef.current.nodes([imageRef.current]);
            trRef.current.getLayer()?.batchDraw();
          }
        }}
      />
      <Transformer ref={trRef} />
    </>
  );
}
