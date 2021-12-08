package com.example.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "session")
public class SessionEntity extends BaseEntity{
	
	@ManyToOne
	@JoinColumn(name = "movie_id", nullable = false)
	private MovieEntity movie;
	
	@ManyToOne
	@JoinColumn(name = "cinema_id", nullable = false)
	private CinemaEntity cinema;
	
	@Column(name = "show_time")
	private Date showTime;
	
	@Column(name = "finish_time")
	private Date finishTime;
	
	@OneToMany(mappedBy = "session")
	List<TicketEntity> tickets = new ArrayList<>();

	public MovieEntity getMovie() {
		return movie;
	}

	public void setMovie(MovieEntity movie) {
		this.movie = movie;
	}

	public CinemaEntity getCinema() {
		return cinema;
	}

	public void setCinema(CinemaEntity cinema) {
		this.cinema = cinema;
	}


	public Date getShowTime() {
		return showTime;
	}

	public void setShowTime(Date showTime) {
		this.showTime = showTime;
	}

	public List<TicketEntity> getTickets() {
		return tickets;
	}

	public void setTickets(List<TicketEntity> tickets) {
		this.tickets = tickets;
	}

	public Date getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Date finishTime) {
		this.finishTime = finishTime;
	}
	
	
	
}
