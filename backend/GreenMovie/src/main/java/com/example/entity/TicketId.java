package com.example.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class TicketId implements Serializable{

	private static final long serialVersionUID = -1706485144848525547L;

	@Column(name = "session_id")
	private Long sessionId;
	
	@Column(name = "seat_id")
	private Integer seatId;

	public Long getSessionId() {
		return sessionId;
	}

	public void setSessionId(Long sessionId) {
		this.sessionId = sessionId;
	}

	public Integer getSeatId() {
		return seatId;
	}

	public void setSeatId(Integer seatId) {
		this.seatId = seatId;
	}
	
	
	
}
