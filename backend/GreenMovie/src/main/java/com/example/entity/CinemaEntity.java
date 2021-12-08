package com.example.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.example.constants.ETypeCinema;

@Entity
@Table(name = "cinema")
public class CinemaEntity extends BaseEntity{
	
	@Column(name = "name", nullable = false)
	private Integer name;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "type", length = 20, nullable = false)
	private ETypeCinema type;
	
	@Column(name = "number_seats", nullable = false)
	private Integer numberSeats;
	
	@Column(name = "price", nullable = false)
	private Long price;
	
	@OneToMany(mappedBy = "cinema")
	private List<SessionEntity> sessions = new ArrayList<>();



	public ETypeCinema getType() {
		return type;
	}

	public void setType(ETypeCinema type) {
		this.type = type;
	}

	public Integer getNumberSeats() {
		return numberSeats;
	}

	public void setNumberSeats(Integer numberSeats) {
		this.numberSeats = numberSeats;
	}

	public List<SessionEntity> getSessions() {
		return sessions;
	}

	public void setSessions(List<SessionEntity> sessions) {
		this.sessions = sessions;
	}

	public Long getPrice() {
		return price;
	}

	public void setPrice(Long price) {
		this.price = price;
	}

	public Integer getName() {
		return name;
	}

	public void setName(Integer name) {
		this.name = name;
	}
	
	
	
}
