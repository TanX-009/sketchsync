import axios, {
  AxiosError,
  AxiosResponse,
  AxiosResponseTransformer,
} from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL as string,
  timeout: 300000,
  headers: {
    Accept: "application/json",
    "content-type": "application/json",
  },
});

const formDataInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL as string,
  timeout: 100000,
  headers: {
    Accept: "application/json",
    "content-type": "multipart/form-data",
  },
});

function requestFailureCallback(url: string, error: AxiosError): any {
  if (error.response) {
    console.log(
      `Request Failed for ${url}: The request was made and the server responded with erroneous status code`,
      error.response.data,
    );
  } else if (error.request) {
    console.log(
      `Request Failed for ${url}: The request was made but no response was received`,
    );
  } else {
    console.log(
      `Error due to bad request configuration for ${url}`,
      error.message,
    );
  }
  throw error;
}

async function get(url: string, params?: Record<string, any>): Promise<any> {
  return instance
    .get(url, { params })
    .then((response: AxiosResponse) => response.data)
    .catch((error: AxiosError) => requestFailureCallback(url, error));
}

async function post(url: string, data: Object): Promise<any> {
  return instance
    .post(url, data)
    .then((response: AxiosResponse) => response.data)
    .catch((error: AxiosError) => requestFailureCallback(url, error));
}

async function formDataPost(url: string, data?: FormData): Promise<any> {
  return formDataInstance
    .post(url, data)
    .then((response: AxiosResponse) => response.data)
    .catch((error: AxiosError) => requestFailureCallback(url, error));
}

export { get, post, formDataPost };
