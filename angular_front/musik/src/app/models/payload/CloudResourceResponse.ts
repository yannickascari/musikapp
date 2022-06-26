export interface CloudResourceResponse {
  url : string;
}

const RESOURCE_NOT_FOUND = "Resource not found !";

export function cloudResourceExists(cloudResourceResponse : CloudResourceResponse) {
  return cloudResourceResponse.url !== RESOURCE_NOT_FOUND;
}
