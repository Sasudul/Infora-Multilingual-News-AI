package com.infora.backend.repository;

import com.google.cloud.firestore.*;
import com.infora.backend.model.GovService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Repository
@RequiredArgsConstructor
public class GovServiceRepository {

    private final Firestore firestore;
    private static final String COLLECTION = "govServices";

    @SuppressWarnings("unchecked")
    public List<GovService> findAll() {
        try {
            QuerySnapshot snapshot = firestore.collection(COLLECTION).get().get();
            return snapshot.getDocuments().stream()
                    .map(this::documentToService)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to fetch government services", e);
            throw new RuntimeException("Failed to fetch government services", e);
        }
    }

    public Optional<GovService> findById(String id) {
        try {
            DocumentSnapshot doc = firestore.collection(COLLECTION).document(id).get().get();
            if (!doc.exists()) return Optional.empty();
            return Optional.of(documentToService(doc));
        } catch (Exception e) {
            log.error("Failed to fetch government service: {}", id, e);
            throw new RuntimeException("Failed to fetch government service", e);
        }
    }

    public GovService save(GovService service) {
        try {
            String docId = service.getId() != null ? service.getId() : UUID.randomUUID().toString();
            service.setId(docId);

            Map<String, Object> data = new HashMap<>();
            data.put("name_en", service.getNameEn());
            data.put("name_si", service.getNameSi());
            data.put("name_ta", service.getNameTa());
            data.put("description_en", service.getDescriptionEn());
            data.put("description_si", service.getDescriptionSi());
            data.put("description_ta", service.getDescriptionTa());
            data.put("icon", service.getIcon());
            data.put("color", service.getColor());
            data.put("processingTime", service.getProcessingTime());
            data.put("fee", service.getFee());
            data.put("officialSource", service.getOfficialSource());
            data.put("officialUrl", service.getOfficialUrl());
            data.put("documents", service.getDocuments());
            data.put("steps", service.getSteps());

            firestore.collection(COLLECTION).document(docId).set(data).get();
            log.info("Government service saved: {}", docId);
            return service;
        } catch (Exception e) {
            log.error("Failed to save government service", e);
            throw new RuntimeException("Failed to save government service", e);
        }
    }

    @SuppressWarnings("unchecked")
    private GovService documentToService(DocumentSnapshot doc) {
        return GovService.builder()
                .id(doc.getId())
                .nameEn(doc.getString("name_en"))
                .nameSi(doc.getString("name_si"))
                .nameTa(doc.getString("name_ta"))
                .descriptionEn(doc.getString("description_en"))
                .descriptionSi(doc.getString("description_si"))
                .descriptionTa(doc.getString("description_ta"))
                .icon(doc.getString("icon"))
                .color(doc.getString("color"))
                .processingTime(doc.getString("processingTime"))
                .fee(doc.getString("fee"))
                .officialSource(doc.getString("officialSource"))
                .officialUrl(doc.getString("officialUrl"))
                .documents((List<String>) doc.get("documents"))
                .steps((List<String>) doc.get("steps"))
                .build();
    }
}
