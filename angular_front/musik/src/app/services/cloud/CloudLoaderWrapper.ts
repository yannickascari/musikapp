import {cloudResourceExists, CloudResourceResponse} from "../../models/payload/CloudResourceResponse";
import {CloudLoadCallback} from "./CloudLoadCallback";

export function wrapCloudCallback(res : any, callback : CloudLoadCallback) {
  const r = res as CloudResourceResponse;
  if (cloudResourceExists(r)){
    callback.onFound(r.url);
  } else {
    callback.onNotFound();
  }
}
