package com.example.canvas.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@Document(collection = "projects")
public class Project {

    @Id
    @JsonProperty("_id")
    private String id;

    private String name;
    private String description;
    private List<String> tags;
    private String type;
    private List<Map<String, Object>> nodes;
    private List<Map<String, Object>> edges;
    private int completionPercent;
    private String createdAt;
    private String updatedAt;
    private String ownerEmail;

    // Constructors
    public Project() {
    }

    public Project(String id, String name, String description, List<String> tags, String type, 
                   List<Map<String, Object>> nodes, List<Map<String, Object>> edges, 
                   int completionPercent, String createdAt, String updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tags = tags;
        this.type = type;
        this.nodes = nodes;
        this.edges = edges;
        this.completionPercent = completionPercent;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Project(String id, String name, String description, List<String> tags, String type, 
                   List<Map<String, Object>> nodes, List<Map<String, Object>> edges, 
                   int completionPercent, String createdAt, String updatedAt, String ownerEmail) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tags = tags;
        this.type = type;
        this.nodes = nodes;
        this.edges = edges;
        this.completionPercent = completionPercent;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.ownerEmail = ownerEmail;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Map<String, Object>> getNodes() {
        return nodes;
    }

    public void setNodes(List<Map<String, Object>> nodes) {
        this.nodes = nodes;
    }

    public List<Map<String, Object>> getEdges() {
        return edges;
    }

    public void setEdges(List<Map<String, Object>> edges) {
        this.edges = edges;
    }

    public int getCompletionPercent() {
        return completionPercent;
    }

    public void setCompletionPercent(int completionPercent) {
        this.completionPercent = completionPercent;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }
}
