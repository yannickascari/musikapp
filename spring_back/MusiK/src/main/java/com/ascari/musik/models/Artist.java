package com.ascari.musik.models;

import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Document("artist")
public class Artist {

    @Id
    private String id;
    private String name;
    private String email;
    private String password;

    private Set<String> followers = new HashSet<>();
    private Set<String> followings = new HashSet<>();

    @DBRef
    private Set<Song> songs = new HashSet<>();

    @DBRef
    private Set<Role> roles = new HashSet<>();

    public Artist() {}

    public Artist(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Set<String> getFollowers() {
        return followers;
    }

    public void setFollowers(Set<String> followers) {
        this.followers = followers;
    }

    public Set<String> getFollowings() {
        return followings;
    }

    public void setFollowings(Set<String> followings) {
        this.followings = followings;
    }

    public Set<Song> getSongs() {
        return songs;
    }

    public void setSongs(Set<Song> songs) {
        this.songs = songs;
    }

    public void addSong(Song song) {
        this.songs.add(song);
    }

    public boolean selfFollow() {
        return this.followings.contains(id) || this.followers.contains(id);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Artist artist = (Artist) o;
        return Objects.equals(id, artist.id) && Objects.equals(name, artist.name) && Objects.equals(password, artist.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, email, password, followers, followings, roles);
    }
}
