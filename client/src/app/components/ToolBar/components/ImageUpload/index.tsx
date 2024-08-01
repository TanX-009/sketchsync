import Button from "@/components/ui/Button";
import React, { useContext } from "react";
import styles from "./styles.module.css";
import { FaImage } from "react-icons/fa6";
import useUploadImage from "@/hooks/uploadImage";
import { TContext, UContext } from "@/components/lib/UserContext";
import { TActionImage, TImage } from "@/app/components/Whiteboard/types";
import { TBoardActions } from "@/app/page";

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

    const url = await uploadImage(formData);

    const image: TImage = {
      src: url,
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
    };
    const actionImage: TActionImage = {
      user: context.user,
      roomCode: context.roomCode,
      type: "image",
      latest: true,
      payload: image,
    };
    boardActions.addImage(actionImage);
  };

  return (
    <label className={"lowContrastClickable " + styles.imageUpload}>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <FaImage />
    </label>
  );
}
