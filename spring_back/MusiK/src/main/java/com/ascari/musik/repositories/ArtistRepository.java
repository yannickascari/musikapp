package com.ascari.musik.repositories;

import com.ascari.musik.models.Artist;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ArtistRepository extends MongoRepository<Artist, String> {

    Optional<Artist> findByName(String name);
    Boolean existsByName(String name);
    Boolean existsByEmail(String email);
    List<Artist> findByNameLike(String val);

}
