package com.ascari.musik.payloads.response;

import com.ascari.musik.models.Artist;
import com.ascari.musik.models.Song;

import java.util.List;

public class JwtResponse {

    private String token;
    private String type;
    private String id;
    private String name;
    private String email;
    private List<String> roles;
    private List<String> followers;
    private List<String> followings;
    private List<Song> songs;

    public JwtResponse(String token, String id, String name, String email, List<String> roles, List<String> followers, List<String> followings, List<Song> songs) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.followers = followers;
        this.followings = followings;
        this.songs = songs;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public List<String> getFollowers() {
        return followers;
    }

    public void setFollowers(List<String> followers) {
        this.followers = followers;
    }

    public List<String> getFollowings() {
        return followings;
    }

    public void setFollowings(List<String> followings) {
        this.followings = followings;
    }

    public List<Song> getSongs() {
        return songs;
    }

    public void setSongs(List<Song> songs) {
        this.songs = songs;
    }
}
