package com.ascari.musik.controllers;

import com.ascari.musik.models.Artist;
import com.ascari.musik.models.ArtistDetails;
import com.ascari.musik.models.ERole;
import com.ascari.musik.models.Role;
import com.ascari.musik.payloads.request.LoginRequest;
import com.ascari.musik.payloads.request.SignupRequest;
import com.ascari.musik.payloads.response.JwtResponse;
import com.ascari.musik.payloads.response.MessageResponse;
import com.ascari.musik.repositories.ArtistRepository;
import com.ascari.musik.repositories.RoleRepository;
import com.ascari.musik.security.jwt.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private AuthenticationManager authenticationManager;
    private ArtistRepository artistRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder encoder;
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        logger.info("POST Request /api/auth/login name : {}", loginRequest.getName());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getName(),loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwt(authentication);

        ArtistDetails artistDetails = (ArtistDetails) authentication.getPrincipal();
        List<String> roles = artistDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        return ResponseEntity.ok(new JwtResponse(jwt, artistDetails.id(), artistDetails.getUsername(), artistDetails.email(), roles, artistDetails.followers().stream().toList(), artistDetails.followings().stream().toList(),artistDetails.songs().stream().toList()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        logger.info("POST Request /api/auth/register name : {} email : {}", signUpRequest.getName(), signUpRequest.getEmail());
        if (artistRepository.existsByName(signUpRequest.getName())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }
        if (artistRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        Artist artist = new Artist(signUpRequest.getName(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        artist.setRoles(new HashSet<>(Set.of(userRole)));
        artistRepository.save(artist);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @Autowired
    public void setJwtUtils(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Autowired
    public void setArtistRepository(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    @Autowired
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Autowired
    public void setRoleRepository(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Autowired
    public void setEncoder(PasswordEncoder encoder) {
        this.encoder = encoder;
    }
}
