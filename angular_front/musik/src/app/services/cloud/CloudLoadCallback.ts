export interface CloudLoadCallback {
  onFound : (url : string) => void;
  onNotFound : () => void;
}
