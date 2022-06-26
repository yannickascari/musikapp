package com.ascari.musik.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.persistence.Id;

@Document(collection = "roles")
public class Role {

    @Id
    private String id;
    private ERole name;

    public Role() {}

    public Role(ERole name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }

    public GrantedAuthority toGrantedAuthority() {
        return new SimpleGrantedAuthority(name.name());
    }

}
