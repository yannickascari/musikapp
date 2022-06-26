package com.ascari.musik.payloads.response;

import com.ascari.musik.services.BlobService;

public class CloudResourceResponse {

    private String url;

    private CloudResourceResponse(final String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public static class CloudResourceResponseFactory{

        public static CloudResourceResponse of(String url) {
            return new CloudResourceResponse(url);
        }

        public static CloudResourceResponse notFound() {
            return new CloudResourceResponse(BlobService.RESOURCE_NOT_FOUND);
        }

    }

}
