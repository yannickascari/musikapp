package com.ascari.musik.repositories;

import com.ascari.musik.models.Song;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SongRepository extends MongoRepository<Song, String> {

}
