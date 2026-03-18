package com.infora.backend.model;

import java.util.List;

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

    public GovService() {}

    public GovService(String id, String nameEn, String nameSi, String nameTa, String descriptionEn, String descriptionSi, String descriptionTa, String icon, String color, String processingTime, String fee, String officialSource, String officialUrl, List<String> documents, List<String> steps) {
        this.id = id;
        this.nameEn = nameEn;
        this.nameSi = nameSi;
        this.nameTa = nameTa;
        this.descriptionEn = descriptionEn;
        this.descriptionSi = descriptionSi;
        this.descriptionTa = descriptionTa;
        this.icon = icon;
        this.color = color;
        this.processingTime = processingTime;
        this.fee = fee;
        this.officialSource = officialSource;
        this.officialUrl = officialUrl;
        this.documents = documents;
        this.steps = steps;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNameEn() { return nameEn; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }
    public String getNameSi() { return nameSi; }
    public void setNameSi(String nameSi) { this.nameSi = nameSi; }
    public String getNameTa() { return nameTa; }
    public void setNameTa(String nameTa) { this.nameTa = nameTa; }
    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    public String getDescriptionSi() { return descriptionSi; }
    public void setDescriptionSi(String descriptionSi) { this.descriptionSi = descriptionSi; }
    public String getDescriptionTa() { return descriptionTa; }
    public void setDescriptionTa(String descriptionTa) { this.descriptionTa = descriptionTa; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getProcessingTime() { return processingTime; }
    public void setProcessingTime(String processingTime) { this.processingTime = processingTime; }
    public String getFee() { return fee; }
    public void setFee(String fee) { this.fee = fee; }
    public String getOfficialSource() { return officialSource; }
    public void setOfficialSource(String officialSource) { this.officialSource = officialSource; }
    public String getOfficialUrl() { return officialUrl; }
    public void setOfficialUrl(String officialUrl) { this.officialUrl = officialUrl; }
    public List<String> getDocuments() { return documents; }
    public void setDocuments(List<String> documents) { this.documents = documents; }
    public List<String> getSteps() { return steps; }
    public void setSteps(List<String> steps) { this.steps = steps; }
}
