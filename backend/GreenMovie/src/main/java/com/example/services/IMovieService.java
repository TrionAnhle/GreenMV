package com.example.services;

import com.example.api.response.admin.MovieResponse;
import com.example.dtos.admin.MovieDTO;

public interface IMovieService {
	MovieResponse findAll();
	MovieDTO findOneById(Long id);
	MovieResponse findOne(Long id);
	MovieResponse save(MovieDTO dto);
	MovieResponse delete(Long[] ids);
	MovieResponse updateCatgoryOrThumbnail(MovieDTO dto);
}
