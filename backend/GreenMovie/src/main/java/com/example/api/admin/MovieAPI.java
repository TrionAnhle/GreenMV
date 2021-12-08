package com.example.api.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.api.response.admin.MovieResponse;
import com.example.dtos.admin.MovieDTO;
import com.example.services.IMovieService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController(value = "MovieOfAdmin")
@RequestMapping(value = "/api/admin/movie")
public class MovieAPI {
	@Autowired
	private IMovieService movieService;
	
	@GetMapping
	public ResponseEntity<MovieResponse> findAll(){
		MovieResponse resp = movieService.findAll();
		return new ResponseEntity<MovieResponse>(resp, HttpStatus.OK);
	}
	
	@GetMapping(value = "/{id}")
	public ResponseEntity<MovieResponse> findOne(@PathVariable(name = "id") long id){
		MovieResponse resp = movieService.findOne(id);
		return new ResponseEntity<MovieResponse>(resp, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<MovieResponse> save(@RequestBody MovieDTO dto){
		MovieResponse resp = movieService.save(dto);
		return new ResponseEntity<MovieResponse>(resp, HttpStatus.OK);
	}
	
	@PostMapping(value = "/update")
	public ResponseEntity<MovieResponse> updateCategoryOrImage(@RequestBody MovieDTO dto){
		MovieResponse resp = movieService.updateCatgoryOrThumbnail(dto);
		return new ResponseEntity<MovieResponse>(resp, HttpStatus.OK);
	}
	
	@PostMapping(value = "/delete")
	public ResponseEntity<MovieResponse> delete(@RequestBody Long[] ids){
		MovieResponse resp = movieService.delete(ids);
		return new ResponseEntity<MovieResponse>(resp, HttpStatus.OK);
	}
}
