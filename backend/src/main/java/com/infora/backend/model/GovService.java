package com.infora.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GovService {
    private String id;
    private String nameEn;
    private String nameSi;
    private String nameTa;
    private String descriptionEn;
    private String descriptionSi;
    private String descriptionTa;
    private String icon;
    private String color;
    private String processingTime;
    private String fee;
    private String officialSource;
    private String officialUrl;
    private List<String> documents;
    private List<String> steps;
}
