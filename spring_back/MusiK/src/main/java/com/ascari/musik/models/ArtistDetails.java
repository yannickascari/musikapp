package com.ascari.musik.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.util.Collection;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public record ArtistDetails(String id, String name, String email,
                            @JsonIgnore String password,
                            Collection<? extends GrantedAuthority> authorities, Set<String> followers, Set<String> followings, Set<Song> songs) implements UserDetails {

    @Serial
    private static final long serialVersionUID = 1L;

    public static ArtistDetails build(Artist artist) {
        return new ArtistDetails(artist.getId(), artist.getName(), artist.getEmail(), artist.getPassword(), artist.getRoles().stream().map(Role::toGrantedAuthority).collect(Collectors.toList()), artist.getFollowers(), artist.getFollowings(), artist.getSongs());
    }

    @Override
    public String id() {
        return id;
    }

    @Override
    public String email() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return name;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ArtistDetails that = (ArtistDetails) o;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name) && Objects.equals(email, that.email) && Objects.equals(password, that.password) && Objects.equals(authorities, that.authorities);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, email, password, authorities, followers, followings);
    }
}
