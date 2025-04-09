package com.example.mobi.controller;

import com.example.mobi.model.Categories;
import com.example.mobi.service.CategoriesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoriesService categoriesService;

    public CategoryController(CategoriesService categoriesService) {
        this.categoriesService = categoriesService;
    }

    @PostMapping
    public ResponseEntity<String> addCategory(@RequestBody Categories category) {
        if (categoriesService.getAllCategories()
                .stream()
                .anyMatch(c -> c.getCategoryName().equalsIgnoreCase(category.getCategoryName()))) {
            return ResponseEntity.badRequest().body("Category already exists");
        }
        category.setActive(true); // Updated here
        categoriesService.createCategory(category);
        return ResponseEntity.ok("Category added successfully");
    }

    @PostMapping("/bulk")
    public ResponseEntity<String> addCategories(@RequestBody List<Categories> categories) {
        categories.forEach(c -> c.setActive(true)); // Updated here
        categoriesService.saveAll(categories);
        return ResponseEntity.ok("Categories added successfully");
    }

    @GetMapping("/active")
    public ResponseEntity<List<Categories>> getActiveCategories() {
        return ResponseEntity.ok(categoriesService.getActiveCategories());
    }

    @GetMapping
    public ResponseEntity<List<Categories>> getAllCategories() {
        return ResponseEntity.ok(categoriesService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getCategoryById(@PathVariable Integer id) {
        Optional<Categories> category = categoriesService.getCategoryById(id);
        return category.<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().body("Category not found"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCategory(@PathVariable Integer id, @RequestBody Categories categoryDetails) {
        Optional<Categories> existingCategory = categoriesService.getCategoryById(id);
        if (existingCategory.isEmpty()) {
            return ResponseEntity.badRequest().body("Category not found");
        }
        Categories category = existingCategory.get();
        category.setCategoryName(categoryDetails.getCategoryName());
        categoriesService.createCategory(category);
        return ResponseEntity.ok("Category updated successfully");
    }

    @PutMapping("/soft-delete/{id}")
    public ResponseEntity<String> softDeleteCategory(@PathVariable Integer id) {
        Optional<Categories> existingCategory = categoriesService.getCategoryById(id);
        if (existingCategory.isEmpty()) {
            return ResponseEntity.badRequest().body("Category not found");
        }
        Categories category = existingCategory.get();
        category.setActive(false); // Updated here
        categoriesService.createCategory(category);
        return ResponseEntity.ok("Category soft-deleted (inactivated) successfully");
    }

    @DeleteMapping("/hard-delete/{id}")
    public ResponseEntity<String> hardDeleteCategory(@PathVariable Integer id) {
        Optional<Categories> existingCategory = categoriesService.getCategoryById(id);
        if (existingCategory.isEmpty()) {
            return ResponseEntity.badRequest().body("Category not found");
        }
        categoriesService.deleteCategory(id);
        return ResponseEntity.ok("Category hard-deleted successfully");
    }
}
