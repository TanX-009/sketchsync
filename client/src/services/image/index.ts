import { formDataPost } from "../serviceConfig";
import Services from "../serviceUrls";

async function postImage(data: FormData): Promise<any> {
  return formDataPost(Services.upload, data);
}

const ImageService = {
  post: postImage,
};

export default ImageService;
