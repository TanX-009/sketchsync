import useImage from "use-image";
import { TImage } from "../../types";
import { useEffect, useRef } from "react";
import Konva from "konva";
import { Image, Transformer } from "react-konva";

interface TProps {
  data: TImage;
  isSelected: boolean;
  onSelect: () => void;
  onTransform: (data: TImage) => void;
}

export default function URLImage({
  data,
  isSelected,
  onSelect,
  onTransform,
}: TProps) {
  const [image] = useImage(data.src);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [image, isSelected]);

  return (
    <>
      <Image
        image={image}
        ref={imageRef}
        alt={"uploaded image"}
        x={data.position.x}
        y={data.position.y}
        width={data.size.width}
        height={data.size.height}
        rotation={data.rotation}
        scaleX={data.scale.x}
        scaleY={data.scale.y}
        draggable={isSelected}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const node = imageRef.current!;
          onTransform({
            ...data,
            position: { x: node.x(), y: node.y() },
          });
        }}
        onTransformEnd={(e) => {
          const node = imageRef.current;
          if (node) {
            onTransform({
              ...data,
              position: { x: node.x(), y: node.y() },
              size: {
                width: node.width(),
                height: node.height(),
              },
              rotation: node.rotation(),
              scale: { x: node.scaleX(), y: node.scaleY() },
            });
          }
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}
