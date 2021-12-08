package com.example.entity;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;

@Entity
@Table(name = "ticket")
public class TicketEntity {
	
	@EmbeddedId
	private TicketId id;
	
	@ManyToOne
	@MapsId("sessionId")
	private SessionEntity session;
	
	@Column(name = "price")
	private Long price;
	
	@ManyToOne
	@JoinColumn(name = "receipt_id")
	private ReceiptEntity receipt;

	public TicketId getId() {
		return id;
	}

	public void setId(TicketId id) {
		this.id = id;
	}

	public SessionEntity getSession() {
		return session;
	}

	public void setSession(SessionEntity session) {
		this.session = session;
	}

	public Long getPrice() {
		return price;
	}

	public void setPrice(Long price) {
		this.price = price;
	}

	public ReceiptEntity getReceipt() {
		return receipt;
	}

	public void setReceipt(ReceiptEntity receipt) {
		this.receipt = receipt;
	}

	
}
