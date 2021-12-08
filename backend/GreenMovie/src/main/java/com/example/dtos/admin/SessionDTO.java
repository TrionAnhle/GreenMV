package com.example.dtos.admin;

import java.util.Date;

public class SessionDTO {
	private Long id;
	private Date createdDate;
	private Date updateDate;
	private String createdBy;
	private String updateBy;
	
	private Long movieId;
	private Long cinemaId;
	private MovieDTO movie;
	private CinemaDTO cinema;
	private String time;
	private Date showTime;
	private Date finishTime;
	private Integer numberBooked;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public String getUpdateBy() {
		return updateBy;
	}
	public void setUpdateBy(String updateBy) {
		this.updateBy = updateBy;
	}
	public MovieDTO getMovie() {
		return movie;
	}
	public void setMovie(MovieDTO movie) {
		this.movie = movie;
	}
	public CinemaDTO getCinema() {
		return cinema;
	}
	public void setCinema(CinemaDTO cinema) {
		this.cinema = cinema;
	}
	public Date getShowTime() {
		return showTime;
	}
	public void setShowTime(Date showTime) {
		this.showTime = showTime;
	}
	public Date getFinishTime() {
		return finishTime;
	}
	public void setFinishTime(Date finishTime) {
		this.finishTime = finishTime;
	}
	public Long getMovieId() {
		return movieId;
	}
	public void setMovieId(Long movieId) {
		this.movieId = movieId;
	}
	public Long getCinemaId() {
		return cinemaId;
	}
	public void setCinemaId(Long cinemaId) {
		this.cinemaId = cinemaId;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public Integer getNumberBooked() {
		return numberBooked;
	}
	public void setNumberBooked(Integer numberBooked) {
		this.numberBooked = numberBooked;
	}
	
	
	
}
