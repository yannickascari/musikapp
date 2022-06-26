package com.ascari.musik.services;

import com.ascari.musik.models.Artist;
import com.ascari.musik.models.Song;
import com.ascari.musik.repositories.SongRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DefaultSongService implements SongService {

    private SongRepository songRepository;
    private ArtistService artistService;
    private static final Logger logger = LoggerFactory.getLogger(DefaultSongService.class);

    @Override
    public Optional<Song> addSong(String id, Song song) {
        final Song finalSong = this.songRepository.save(song);
        Optional<Artist> optionalArtist = this.artistService.getArtistById(id);
        if (optionalArtist.isPresent()) {
            Artist artist = optionalArtist.get();
            artist.addSong(finalSong);
            this.artistService.updateArtist(artist);
            return Optional.of(finalSong);
        }
        return Optional.empty();
    }

    @Override
    public Optional<Song> songFromJson(String json) {
        try {
            return Optional.ofNullable(new ObjectMapper().readValue(json, new TypeReference<>() {}));
        } catch (JsonProcessingException e) {
            logger.error("Cannot convert song to json", e);
            return Optional.empty();
        }
    }

    @Autowired
    public void setSongRepository(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    @Autowired
    public void setArtistService(ArtistService artistService) {
        this.artistService = artistService;
    }
}
