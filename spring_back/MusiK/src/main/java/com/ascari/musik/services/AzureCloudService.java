package com.ascari.musik.services;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.sas.BlobContainerSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import com.azure.storage.common.sas.SasProtocol;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class AzureCloudService implements BlobService {

    @Value("${spring.cloud.azure.storage.blob.connection-string}")
    private String connectionString;

    private static final Logger logger = LoggerFactory.getLogger(AzureCloudService.class);

    @Override
    public String signedSASURL(String containerName, String blobName, int amount, ChronoUnit chronoUnit) {
        BlobContainerSasPermission blobContainerSasPermission = new BlobContainerSasPermission().setReadPermission(true);
        final BlobServiceSasSignatureValues builder = new BlobServiceSasSignatureValues(OffsetDateTime.now().plus(amount, chronoUnit), blobContainerSasPermission).setProtocol(SasProtocol.HTTPS_ONLY);

        final BlobClient blobClient = getBlobClient(connectionString, containerName, blobName);

        return blobClient.exists() ? String.format("https://%s.blob.core.windows.net/%s/%s?%s", blobClient.getAccountName(), blobClient.getContainerName(), blobName, blobClient.generateSas(builder)) : BlobService.RESOURCE_NOT_FOUND;
    }

    @Override
    public Optional<String> storeFile(MultipartFile file, String container, String blobName) {
        BlobClient blobClient = getBlobClient(connectionString, container, blobName);

        if (blobClient.exists()) {
            logger.warn("The file already exists in the storage [ FileName : {} ]", file.getOriginalFilename());
            return Optional.ofNullable(blobClient.getBlobUrl());
        }
        try {
            blobClient.upload(file.getInputStream(), file.getSize());
            logger.info("Uploading file to {} container [Filename : {}, Original file name : {}]", container, blobName, file.getOriginalFilename());

            return Optional.ofNullable(blobClient.getBlobUrl());
        } catch (IOException e) {
            logger.error("File {} could not be uploaded !", file.getOriginalFilename(), e);
        }

        return Optional.empty();
    }
}
