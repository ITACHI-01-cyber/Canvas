package com.example.canvas.controller;

import com.example.canvas.model.Project;
import com.example.canvas.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public List<Project> getAllProjects(@RequestHeader(value = "X-User-Email", required = false) String ownerEmail) {
        String email = (ownerEmail != null && !ownerEmail.trim().isEmpty()) ? ownerEmail : "guest_explorer@example.com";
        System.out.println("DEBUG: getAllProjects called with ownerEmail header: [" + ownerEmail + "] -> scoped to: [" + email + "]");
        
        // Lazy migration: any project in the database without an owner is assigned to guest_explorer@example.com
        try {
            List<Project> unowned = projectRepository.findByOwnerEmailIsNull();
            if (unowned != null && !unowned.isEmpty()) {
                System.out.println("DEBUG: Found " + unowned.size() + " unclaimed legacy projects. Migrating to guest...");
                for (Project p : unowned) {
                    p.setOwnerEmail("guest_explorer@example.com");
                    projectRepository.save(p);
                }
            }
        } catch (Exception e) {
            // Log error but proceed to fetch
            System.err.println("Migration of unowned projects failed: " + e.getMessage());
        }

        return projectRepository.findByOwnerEmail(email);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id,
                                                  @RequestHeader(value = "X-User-Email", required = false) String ownerEmail) {
        String email = (ownerEmail != null && !ownerEmail.trim().isEmpty()) ? ownerEmail : "guest_explorer@example.com";
        Optional<Project> projectData = projectRepository.findById(id);
        
        if (projectData.isPresent()) {
            Project project = projectData.get();
            if (project.getOwnerEmail() == null) {
                project.setOwnerEmail(email);
                projectRepository.save(project);
            }
            if (project.getOwnerEmail().equals(email)) {
                return ResponseEntity.ok(project);
            }
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project,
                                                 @RequestHeader(value = "X-User-Email", required = false) String ownerEmail) {
        try {
            if (project.getId() == null || project.getId().trim().isEmpty()) {
                project.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 9));
            }
            String now = Instant.now().toString();
            if (project.getCreatedAt() == null || project.getCreatedAt().isEmpty()) {
                project.setCreatedAt(now);
            }
            project.setUpdatedAt(now);
            
            String email = (ownerEmail != null && !ownerEmail.trim().isEmpty()) ? ownerEmail : "guest_explorer@example.com";
            System.out.println("DEBUG: createProject called with ownerEmail header: [" + ownerEmail + "] -> assigning project owner: [" + email + "]");
            project.setOwnerEmail(email);
            
            Project savedProject = projectRepository.save(project);
            return new ResponseEntity<>(savedProject, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @RequestBody Project projectDetails,
                                                 @RequestHeader(value = "X-User-Email", required = false) String ownerEmail) {
        String email = (ownerEmail != null && !ownerEmail.trim().isEmpty()) ? ownerEmail : "guest_explorer@example.com";
        Optional<Project> projectData = projectRepository.findById(id);

        if (projectData.isPresent()) {
            Project project = projectData.get();
            if (project.getOwnerEmail() == null) {
                project.setOwnerEmail(email);
                projectRepository.save(project);
            }
            if (!project.getOwnerEmail().equals(email)) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            
            if (projectDetails.getName() != null) {
                project.setName(projectDetails.getName());
            }
            if (projectDetails.getDescription() != null) {
                project.setDescription(projectDetails.getDescription());
            }
            if (projectDetails.getTags() != null) {
                project.setTags(projectDetails.getTags());
            }
            if (projectDetails.getType() != null) {
                project.setType(projectDetails.getType());
            }
            if (projectDetails.getNodes() != null) {
                project.setNodes(projectDetails.getNodes());
            }
            if (projectDetails.getEdges() != null) {
                project.setEdges(projectDetails.getEdges());
            }
            
            project.setCompletionPercent(projectDetails.getCompletionPercent());
            project.setUpdatedAt(Instant.now().toString());

            return new ResponseEntity<>(projectRepository.save(project), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteProject(@PathVariable String id,
                                                    @RequestHeader(value = "X-User-Email", required = false) String ownerEmail) {
        try {
            String email = (ownerEmail != null && !ownerEmail.trim().isEmpty()) ? ownerEmail : "guest_explorer@example.com";
            Optional<Project> projectData = projectRepository.findById(id);
            if (projectData.isPresent()) {
                Project project = projectData.get();
                if (project.getOwnerEmail() == null) {
                    project.setOwnerEmail(email);
                    projectRepository.save(project);
                }
                if (!project.getOwnerEmail().equals(email)) {
                    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
                }
                projectRepository.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
