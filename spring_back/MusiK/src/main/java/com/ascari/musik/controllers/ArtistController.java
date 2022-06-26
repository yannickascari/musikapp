package com.ascari.musik.controllers;

import com.ascari.musik.models.Artist;
import com.ascari.musik.models.ArtistDetails;
import com.ascari.musik.payloads.response.CloudResourceResponse;
import com.ascari.musik.services.ArtistService;
import com.ascari.musik.services.BlobService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/artist")
public class ArtistController {

    private ArtistService artistService;
    private BlobService blobService;
    private static final Logger logger = LoggerFactory.getLogger(ArtistController.class);

    private static final String[] SUPPORTED_FORMAT_AVATAR = {".png",".jpg",".jfif",".jpeg"};

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        ArtistDetails artistDetails = (ArtistDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        logger.info("GET Request /api/artist/me");
        Optional<Artist> artist = this.artistService.getArtistById(artistDetails.id());
        if (artist.isPresent()) {
            Artist me = artist.get();
            return ResponseEntity.ok(me);
        } else {
            return ResponseEntity.badRequest().body("Error cannot find user !");
        }
    }

    @GetMapping("/search/{searchValue}")
    public List<Artist> search(@PathVariable String searchValue) {
        ArtistDetails artistDetails = (ArtistDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        logger.info("GET Request /api/artist/search/{}", searchValue);
        return this.artistService.findAllArtistsLikeExceptOne(searchValue, artistDetails.id());
    }

    @GetMapping("/{id}/avatar")
    public @ResponseBody CloudResourceResponse getAvatar(@PathVariable String id) {
        logger.info("GET Request /api/artist/{}/avatar", id);
        for (String s : SUPPORTED_FORMAT_AVATAR) {
            String url = blobService.signedSASURL("avatars",id + s,60, ChronoUnit.MINUTES);
            if (!url.equals(BlobService.RESOURCE_NOT_FOUND))
                return CloudResourceResponse.CloudResourceResponseFactory.of(url);
        }
        return CloudResourceResponse.CloudResourceResponseFactory.notFound();
    }

    @GetMapping("/{id}/followers")
    public @ResponseBody List<Artist> getFollowers(@PathVariable String id) {
        logger.info("GET Request /api/artist/{}/followers", id);
        return artistService.getFollowers(id).orElseGet(ArrayList::new);
    }

    @GetMapping("/{id}/followings")
    public @ResponseBody List<Artist> getFollowings(@PathVariable String id) {
        logger.info("GET Request /api/artist/{}/followings", id);
        return artistService.getFollowings(id).orElseGet(ArrayList::new);
    }

    @PutMapping("/{id}")
    public @ResponseBody ResponseEntity<?> updateArtist(@PathVariable String id, @RequestBody Artist artist) {
        logger.info("PUT Request /api/artist/{}", id);
        if (artist.selfFollow())
            return ResponseEntity.badRequest().body("Unable to follow yourself");
        if (!artist.getId().equals(id))
            return ResponseEntity.badRequest().body("Error id of the artist has to be the same as in the json body");
        return ResponseEntity.ok(artistService.updateArtist(artist));
    }

    @Autowired
    public void setArtistService(ArtistService artistService) {
        this.artistService = artistService;
    }

    @Autowired
    public void setBlobService(BlobService blobService) {
        this.blobService = blobService;
    }
}
