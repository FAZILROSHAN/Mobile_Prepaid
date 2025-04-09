package com.example.mobi.service;

import com.example.mobi.model.Categories;
import java.util.List;
import java.util.Optional;

public interface CategoriesService {
    List<Categories> getAllCategories();
    List<Categories> getActiveCategories();
    Optional<Categories> getCategoryById(Integer id);
    Categories createCategory(Categories category);
    void deleteCategory(Integer id);
    void softDeleteCategory(Integer id);
    void saveAll(List<Categories> categories);
}
