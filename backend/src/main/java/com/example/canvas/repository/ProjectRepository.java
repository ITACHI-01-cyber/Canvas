package com.example.canvas.repository;

import com.example.canvas.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {

    List<Project> findByOwnerEmail(String ownerEmail);

    List<Project> findByOwnerEmailIsNull();
}
