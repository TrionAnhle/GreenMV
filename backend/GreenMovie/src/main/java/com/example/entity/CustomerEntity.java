package com.example.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "customer")
public class CustomerEntity{
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

	@Column(name = "email")
	private String email;

	@OneToMany(mappedBy = "customer")
	List<ReceiptEntity> receipts = new ArrayList<>();

	@MapsId
	@OneToOne
	@JoinColumn(name = "account_id", nullable = false, updatable = false)
	private AccountEntity accountC;

	public String getFullName() {
		return fullName;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<ReceiptEntity> getReceipts() {
		return receipts;
	}

	public void setReceipts(List<ReceiptEntity> receipts) {
		this.receipts = receipts;
	}

	public AccountEntity getAccountC() {
		return accountC;
	}

	public void setAccountC(AccountEntity accountC) {
		this.accountC = accountC;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public Boolean getSex() {
		return sex;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}
