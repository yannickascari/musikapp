package com.ascari.musik.services;

import com.ascari.musik.models.Song;

import java.util.Optional;

public interface SongService {

    Optional<Song> addSong(String id, Song song);

    Optional<Song> songFromJson(String json);

}
