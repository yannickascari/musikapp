package com.ascari.musik.controllers;


import com.ascari.musik.models.Artist;
import com.ascari.musik.models.ArtistDetails;
import com.ascari.musik.models.Song;
import com.ascari.musik.payloads.response.CloudResourceResponse;
import com.ascari.musik.services.ArtistService;
import com.ascari.musik.services.BlobService;
import com.ascari.musik.services.SongService;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/artist/{artistId}")
public class SongController {

    private SongService songService;
    private ArtistService artistService;
    private BlobService blobService;
    private static final Logger logger = LoggerFactory.getLogger(SongController.class);

    private static final String[] SUPPORTED_FORMAT_MINIATURE = {"png","jpg","jfif","jpeg"};
    private static final Set<String> WRAPPER_SUPPORTED_FORMAT = Set.of(SUPPORTED_FORMAT_MINIATURE);

    @PostMapping(value = "/songs", consumes = {MediaType.APPLICATION_JSON_VALUE,  MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> addSong(@PathVariable String artistId, @RequestPart("song") String stringSong, @RequestPart("song_content") MultipartFile songContent, @RequestPart("song_miniature") MultipartFile songMiniature) {
        logger.info("POST Request /api/artist/{}/songs", artistId);
        ArtistDetails artistDetails = (ArtistDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<Song> optionalSong = songService.songFromJson(stringSong);
        String extensionMiniature = FilenameUtils.getExtension(songMiniature.getOriginalFilename());
        if (!WRAPPER_SUPPORTED_FORMAT.contains(extensionMiniature))
            return ResponseEntity.badRequest().body("Error format of the miniature not supported !");
        if (optionalSong.isEmpty())
            return ResponseEntity.badRequest().body("Error could not create the song !");
        if (!artistDetails.id().equals(artistId)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Can't add a song to another user !");
        optionalSong = songService.addSong(artistId, optionalSong.get());
        if (optionalSong.isPresent()) {
            Song song = optionalSong.get();
            blobService.storeFile(songContent, "songs", song.getId() + ".mp3");
            blobService.storeFile(songMiniature, "songs-miniatures", song.getId() + '.' + extensionMiniature);
            return ResponseEntity.ok().body(song);
        }
        return ResponseEntity.badRequest().body("Error could not create the song !");
    }

    @GetMapping("/songs")
    public ResponseEntity<?> getSongs(@PathVariable String artistId) {
        logger.info("GET Request /api/artist/{}/songs", artistId);
        Optional<Artist> optionalArtist = artistService.getArtistById(artistId);
        if (optionalArtist.isPresent())
            return ResponseEntity.ok().body(optionalArtist.get().getSongs());
        return ResponseEntity.badRequest().body("Unable to retrieve artist");
    }

    @GetMapping("/songs/{id}/audio")
    public @ResponseBody CloudResourceResponse getSongAudio(@PathVariable String artistId, @PathVariable String id) {
        logger.info("GET Request /api/artist/{}/songs/{}/audio", artistId, id);
        String url = blobService.signedSASURL("songs", id + ".mp3", 60, ChronoUnit.MINUTES);
        if (!url.equals(BlobService.RESOURCE_NOT_FOUND))
            return CloudResourceResponse.CloudResourceResponseFactory.of(url);
        return CloudResourceResponse.CloudResourceResponseFactory.notFound();
    }

    @GetMapping("/songs/{id}/miniature")
    public @ResponseBody CloudResourceResponse getSongMiniature(@PathVariable String artistId, @PathVariable String id) {
        logger.info("GET Request /api/artist/{}/songs/{}/miniature", artistId, id);
        for (String s : SUPPORTED_FORMAT_MINIATURE) {
            String url = blobService.signedSASURL("songs-miniatures",id + '.' + s,60, ChronoUnit.MINUTES);
            if (!url.equals(BlobService.RESOURCE_NOT_FOUND))
                return CloudResourceResponse.CloudResourceResponseFactory.of(url);
        }
        return CloudResourceResponse.CloudResourceResponseFactory.notFound();
    }

    @Autowired
    public void setSongService(SongService songService) {
        this.songService = songService;
    }

    @Autowired
    public void setBlobService(BlobService blobService) {
        this.blobService = blobService;
    }

    @Autowired
    public void setArtistService(ArtistService artistService) {
        this.artistService = artistService;
    }
}
