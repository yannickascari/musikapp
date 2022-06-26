package com.ascari.musik.models;

import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.HashSet;
import java.util.Set;

@Document("song")
public class Song {

    @Id
    private String id;
    private int numberOfListens;
    private String name;
    @DBRef
    private Category category;
    @DBRef
    private Set<Artist> features = new HashSet<>();

    public Song() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getNumberOfListens() {
        return numberOfListens;
    }

    public void setNumberOfListens(int numberOfListens) {
        this.numberOfListens = numberOfListens;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Set<Artist> getFeatures() {
        return features;
    }

    public void setFeatures(Set<Artist> features) {
        this.features = features;
    }

}
