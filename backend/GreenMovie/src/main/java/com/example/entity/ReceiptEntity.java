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
@Table(name = "receipt")
public class ReceiptEntity extends BaseEntity{
	
	@Column(name = "payment_type", nullable = false)
	private Integer paymentType;
	
	@Column(name = "payment_date", nullable = false)
	private Date paymentDate;
	
	@Column(name = "is_get_ticket", nullable = false)
	private Boolean isGetTicket;
	
	@ManyToOne
	@JoinColumn(name = "customer_id")
	private CustomerEntity customer;

	@OneToMany(mappedBy = "receipt")
	List<TicketEntity> tickets = new ArrayList<>();
	
	
	public Integer getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(Integer paymentType) {
		this.paymentType = paymentType;
	}

	public Date getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(Date paymentDate) {
		this.paymentDate = paymentDate;
	}

	public CustomerEntity getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerEntity customer) {
		this.customer = customer;
	}

	public List<TicketEntity> getTickets() {
		return tickets;
	}

	public void setTickets(List<TicketEntity> tickets) {
		this.tickets = tickets;
	}

	public Boolean getIsGetTicket() {
		return isGetTicket;
	}

	public void setIsGetTicket(Boolean isGetTicket) {
		this.isGetTicket = isGetTicket;
	}

	
}
