package com.infora.backend.service;

import com.infora.backend.dto.UserRequest;
import com.infora.backend.exception.ResourceNotFoundException;
import com.infora.backend.model.User;
import com.infora.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createOrUpdate(String userId, UserRequest request) {
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .preferredLanguage(request.getPreferredLanguage())
                .build();
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
