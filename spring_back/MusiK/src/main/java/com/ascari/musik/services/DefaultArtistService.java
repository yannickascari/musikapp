package com.ascari.musik.services;

import com.ascari.musik.models.Artist;
import com.ascari.musik.repositories.ArtistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DefaultArtistService implements ArtistService {

    private ArtistRepository artistRepository;

    @Override
    public List<Artist> findAllArtistsLikeExceptOne(String like, String artistId) {
        List<Artist> artists = artistRepository.findByNameLike(like);
        return artists.stream().filter(artist -> !artist.getId().equals(artistId)).collect(Collectors.toList());
    }

    @Override
    public Artist updateArtist(Artist artist) {
        return artistRepository.save(artist);
    }

    @Override
    public Optional<Artist> getArtistById(String id) {
        return artistRepository.findById(id);
    }

    @Override
    public Optional<List<Artist>> getFollowers(String id) {
        return getArtistById(id).map(value -> value.getFollowers().stream().map(follower -> getArtistById(follower).orElse(null)).toList());
    }

    @Override
    public Optional<List<Artist>> getFollowings(String id) {
        return getArtistById(id).map(value -> value.getFollowings().stream().map(following -> getArtistById(following).orElse(null)).toList());
    }

    @Autowired
    public void setArtistRepository(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }
}
