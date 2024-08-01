"use client";

import ImageService from "@/services/image";
import { useState } from "react";

export default function useUploadImage() {
  const [status, setStatus] = useState<string>("INIT");

  const uploadImage = async (data: FormData) => {
    try {
      setStatus("LOADING");
      const response = await ImageService.post(data);
      return response.url;
    } catch (error: any) {
      setStatus(error.message || "ERROR");
    } finally {
      setStatus("SUCCESS");
    }
  };

  return { status, uploadImage };
}
