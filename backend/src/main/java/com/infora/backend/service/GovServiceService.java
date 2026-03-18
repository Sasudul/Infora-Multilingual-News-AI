package com.infora.backend.service;

import com.infora.backend.exception.ResourceNotFoundException;
import com.infora.backend.model.GovService;
import com.infora.backend.repository.GovServiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GovServiceService {

    private static final Logger log = LoggerFactory.getLogger(GovServiceService.class);

    private final GovServiceRepository govServiceRepository;

    public GovServiceService(GovServiceRepository govServiceRepository) {
        this.govServiceRepository = govServiceRepository;
    }

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
