package com.example.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(name = "account")
public class AccountEntity extends BaseEntity{
	
	@Column(name = "username", nullable = false, unique = true)
	private String username;

	@Column(name = "password", nullable = false)
	private String password;
	
	@ManyToOne
	@JoinColumn(name = "role_id")
	private RoleEntity role;
	
	@OneToOne(cascade = CascadeType.ALL, mappedBy = "accountC")
	@PrimaryKeyJoinColumn
	private CustomerEntity customer;
	
	@OneToOne(cascade = CascadeType.ALL, mappedBy = "accountS")
	@PrimaryKeyJoinColumn
	private StaffEntity staff;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public RoleEntity getRole() {
		return role;
	}

	public void setRole(RoleEntity role) {
		this.role = role;
	}

	public CustomerEntity getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerEntity customer) {
		this.customer = customer;
	}

	public StaffEntity getStaff() {
		return staff;
	}

	public void setStaff(StaffEntity staff) {
		this.staff = staff;
	}
	
	
}
