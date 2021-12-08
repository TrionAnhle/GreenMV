package com.example.dtos;

import java.util.Date;

public class TicketDTO {
	private Integer seatId;
	private String movie;
	private Integer cinema;
	private Date showTime;
	public Integer getSeatId() {
		return seatId;
	}
	public void setSeatId(Integer seatId) {
		this.seatId = seatId;
	}
	public String getMovie() {
		return movie;
	}
	public void setMovie(String movie) {
		this.movie = movie;
	}
	
	public Date getShowTime() {
		return showTime;
	}
	public void setShowTime(Date showTime) {
		this.showTime = showTime;
	}
	public Integer getCinema() {
		return cinema;
	}
	public void setCinema(Integer cinema) {
		this.cinema = cinema;
	}
	
	
}
