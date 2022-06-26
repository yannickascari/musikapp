package com.ascari.musik.services;

import com.ascari.musik.models.ArtistDetails;
import com.ascari.musik.repositories.ArtistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DefaultArtistDetailsService implements UserDetailsService {

    private ArtistRepository artistRepository;

    @Override
    public ArtistDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        return ArtistDetails.build(artistRepository.findByName(name).orElseThrow(() -> new UsernameNotFoundException("User not found with name : " + name)));
    }

    @Autowired
    public void setArtistRepository(final ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

}
