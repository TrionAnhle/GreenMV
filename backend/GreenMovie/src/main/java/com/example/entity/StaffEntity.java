package com.example.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "staff")
public class StaffEntity{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "fullname")
	private String fullName;

	@Column(name = "sex")
	private Boolean sex;

	@Column(name = "phone")
	private String phone;

	@Column(name = "address")
	private String address;

	@MapsId
	@OneToOne
	@JoinColumn(name = "account_id", nullable = false, updatable = false)
	private AccountEntity accountS;

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public Boolean getSex() {
		return sex;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public AccountEntity getAccountS() {
		return accountS;
	}

	public void setAccountS(AccountEntity accountS) {
		this.accountS = accountS;
	}

	public void setSex(Boolean sex) {
		this.sex = sex;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

}
