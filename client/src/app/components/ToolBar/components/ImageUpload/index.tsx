import Button from "@/components/ui/Button";
import React, { useContext } from "react";
import styles from "./styles.module.css";
import { FaImage } from "react-icons/fa6";
import useUploadImage from "@/hooks/uploadImage";
import { TContext, UContext } from "@/components/lib/UserContext";
import { TActionImage, TImage } from "@/app/components/Whiteboard/types";
import { TBoardActions } from "@/app/page";
import getImageDimensions from "@/components/lib/getImageDimensions";

interface TProps {
  boardActions: TBoardActions;
}

export default function ImageUpload({ boardActions }: TProps) {
  const { status, uploadImage } = useUploadImage();
  const { context } = useContext(UContext) as TContext;

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("roomCode", context.roomCode);

    let url = await uploadImage(formData);
    url = `${process.env.NEXT_PUBLIC_SERVER_API_URL}${url}`;

    let dimensions = { width: 0, height: 0 };

    await getImageDimensions(url)
      .then((d) => {
        dimensions = d;
      })
      .catch((err) => console.error(err));

    // scale the image down if it's too big
    let scaledWidth = window.innerWidth / 3;
    if (scaledWidth > dimensions.width) {
      scaledWidth = dimensions.width;
    }

    const image: TImage = {
      src: url,
      position: { x: 0, y: 0 },
      size: {
        width: scaledWidth,
        height: dimensions.height * (scaledWidth / dimensions.width),
      },
      rotation: 0,
      scale: { x: 1, y: 1 },
    };
    const actionImage: TActionImage = {
      user: context.user,
      roomCode: context.roomCode,
      type: "image",
      latest: true,
      payload: image,
    };
    context.socket.emit("action_CtoS", actionImage);
    boardActions.addImage(actionImage);

    // clear the file input
    event.target.value = "";
  };

  return (
    <label className={"lowContrastClickable " + styles.imageUpload}>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <FaImage />
    </label>
  );
}
