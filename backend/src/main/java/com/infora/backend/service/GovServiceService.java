package com.infora.backend.service;

import com.infora.backend.exception.ResourceNotFoundException;
import com.infora.backend.model.GovService;
import com.infora.backend.repository.GovServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GovServiceService {

    private final GovServiceRepository govServiceRepository;

    public List<GovService> getAllServices() {
        return govServiceRepository.findAll();
    }

    public GovService getService(String id) {
        return govServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Government Service", id));
    }

    public GovService saveService(GovService service) {
        return govServiceRepository.save(service);
    }
}
