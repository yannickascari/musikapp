package com.ascari.musik.services;

import com.ascari.musik.models.Artist;

import java.util.List;
import java.util.Optional;

public interface ArtistService {

    List<Artist> findAllArtistsLikeExceptOne(String like, String artistId);

    Artist updateArtist(Artist artist);

    Optional<Artist> getArtistById(String id);

    Optional<List<Artist>> getFollowers(String id);

    Optional<List<Artist>> getFollowings(String id);

}
