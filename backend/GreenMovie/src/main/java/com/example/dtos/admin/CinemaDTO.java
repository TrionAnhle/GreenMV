package com.example.dtos.admin;

import java.util.Date;

import com.example.constants.ETypeCinema;

public class CinemaDTO {
	private Long id;
	private Date createdDate;
	private Date updateDate;
	private String createdBy;
	private String updateBy;
	
	private Integer name;
	private Integer typeOfCinema;
	private ETypeCinema type;
	private Integer numberSeats;
	private Long price;
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
	public Integer getTypeOfCinema() {
		return typeOfCinema;
	}
	public void setTypeOfCinema(Integer typeOfCinema) {
		this.typeOfCinema = typeOfCinema;
	}
	public Integer getNumberSeats() {
		return numberSeats;
	}
	public void setNumberSeats(Integer numberSeats) {
		this.numberSeats = numberSeats;
	}
	public Long getPrice() {
		return price;
	}
	public void setPrice(Long price) {
		this.price = price;
	}
	public ETypeCinema getType() {
		return type;
	}
	public void setType(ETypeCinema type) {
		this.type = type;
	}
	public Integer getName() {
		return name;
	}
	public void setName(Integer name) {
		this.name = name;
	}
	
	
	
}
