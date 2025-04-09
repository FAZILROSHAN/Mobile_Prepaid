package com.example.mobi.repository;

import com.example.mobi.model.Categories;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriesRepository extends JpaRepository<Categories, Integer> {
    Optional<Categories> findByCategoryName(String categoryName);

    List<Categories> findByActiveTrue(); // this will now work
}

