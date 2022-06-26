package com.ascari.musik.services;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobClientBuilder;
import org.springframework.web.multipart.MultipartFile;

import java.time.temporal.ChronoUnit;
import java.util.Optional;

public interface BlobService {

    String RESOURCE_NOT_FOUND = "Resource not found !";

    default BlobClient getBlobClient(final String connectionString, final String containerName, final String blobName) {
        return new BlobClientBuilder().connectionString(connectionString).containerName(containerName).blobName(blobName).buildClient();
    }

    String signedSASURL(final String containerName, final String blobName, final int amount, final ChronoUnit chronoUnit);

    Optional<String> storeFile(final MultipartFile file, final String container, final String blobName);

}
