package com.example.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "movie")
public class MovieEntity extends BaseEntity{
	
	@Column(name = "name", nullable = false)
	private String name;
	
	@Column(name = "description", columnDefinition = "text")
	private String description;
	
	@Column(name = "path_thumbnail")
	private String pathThumbnail;
	
	@Column(name = "path_video")
	private String pathVideo;
	
	@Column(name = "screen_time", nullable = false)
	private Integer screenTime;
	
	@Column(name = "is_showing")
	private Boolean isShowing;
	
	// relationship
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "movie_category", joinColumns = @JoinColumn(name = "movie_id"),
								inverseJoinColumns = @JoinColumn(name = "category_id"))	
	private List<CategoryEntity> categories = new ArrayList<>();
	
	@OneToMany(mappedBy = "movie")
	private List<SessionEntity> sessions = new ArrayList<>();
	
	
	
	

	public List<SessionEntity> getSessions() {
		return sessions;
	}

	public void setSessions(List<SessionEntity> sessions) {
		this.sessions = sessions;
	}

	public Boolean getIsShowing() {
		return isShowing;
	}

	public void setIsShowing(Boolean isShowing) {
		this.isShowing = isShowing;
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

	public List<CategoryEntity> getCategories() {
		return categories;
	}

	public void setCategories(List<CategoryEntity> categories) {
		this.categories = categories;
	}
	
	
}
