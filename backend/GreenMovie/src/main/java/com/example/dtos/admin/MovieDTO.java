package com.example.dtos.admin;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.example.dtos.CategoryUserDTO;

public class MovieDTO {
	private Long id;
	private Date createdDate;
	private Date updateDate;
	private String createdBy;
	private String updateBy;
	
	private String name;
	private String description;
	private String pathThumbnail;
	private String pathVideo;
	private Integer screenTime;
	private Boolean isShowing;
	private Integer categoryId;
	private List<CategoryUserDTO> category;
	private String base64;
	
	public MovieDTO() {
		this.category = new ArrayList<>();
	}
	public String getBase64() {
		return base64;
	}
	public void setBase64(String base64) {
		this.base64 = base64;
	}
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getPathThumbnail() {
		return pathThumbnail;
	}
	public void setPathThumbnail(String pathThumbnail) {
		this.pathThumbnail = pathThumbnail;
	}
	public String getPathVideo() {
		return pathVideo;
	}
	public void setPathVideo(String pathVideo) {
		this.pathVideo = pathVideo;
	}
	public Integer getScreenTime() {
		return screenTime;
	}
	public void setScreenTime(Integer screenTime) {
		this.screenTime = screenTime;
	}
	public Boolean getIsShowing() {
		return isShowing;
	}
	public void setIsShowing(Boolean isShowing) {
		this.isShowing = isShowing;
	}



	public List<CategoryUserDTO> getCategory() {
		return category;
	}



	public void setCategory(List<CategoryUserDTO> category) {
		this.category = category;
	}
	public Integer getCategoryId() {
		return categoryId;
	}
	public void setCategoryId(Integer categoryId) {
		this.categoryId = categoryId;
	}



	
	
	
}
