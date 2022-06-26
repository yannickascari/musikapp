package com.ascari.musik.repositories;

import com.ascari.musik.models.ERole;
import com.ascari.musik.models.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role, String> {

    Optional<Role> findByName(ERole name);

}
