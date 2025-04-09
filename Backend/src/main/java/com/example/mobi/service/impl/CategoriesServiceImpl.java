package com.example.mobi.service.impl;

import com.example.mobi.model.Categories;
import com.example.mobi.repository.CategoriesRepository;
import com.example.mobi.service.CategoriesService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriesServiceImpl implements CategoriesService {

    private final CategoriesRepository categoriesRepository;

    public CategoriesServiceImpl(CategoriesRepository categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }

    @Override
    public List<Categories> getAllCategories() {
        return categoriesRepository.findAll();
    }

    @Override
    public List<Categories> getActiveCategories() {
        return categoriesRepository.findByActiveTrue();
    }

    @Override
    public Optional<Categories> getCategoryById(Integer id) {
        return categoriesRepository.findById(id);
    }

    @Override
    public Categories createCategory(Categories category) {
        return categoriesRepository.save(category);
    }

    @Override
    public void deleteCategory(Integer id) {
        categoriesRepository.deleteById(id); // hard delete
    }

    @Override
    public void softDeleteCategory(Integer id) {
        Optional<Categories> categoryOpt = categoriesRepository.findById(id);
        categoryOpt.ifPresent(category -> {
            category.setActive(false);
            categoriesRepository.save(category);
        });
    }

    @Override
    public void saveAll(List<Categories> categories) {
        categoriesRepository.saveAll(categories);
    }
}
