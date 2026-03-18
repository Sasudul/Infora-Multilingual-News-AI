package com.infora.backend.service;

import com.infora.backend.dto.UserRequest;
import com.infora.backend.exception.ResourceNotFoundException;
import com.infora.backend.model.User;
import com.infora.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createOrUpdate(String userId, UserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPreferredLanguage(request.getPreferredLanguage());
        return userRepository.save(userId, user);
    }

    public User getUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }

    public void updateLanguage(String userId, String language) {
        if (!language.matches("en|si|ta")) {
            throw new IllegalArgumentException("Invalid language code. Use: en, si, or ta");
        }
        userRepository.updateLanguage(userId, language);
    }

    public void deleteUser(String userId) {
        userRepository.delete(userId);
    }
}
