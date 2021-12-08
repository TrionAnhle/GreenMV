package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.CustomerEntity;

@Repository
public interface ICustomerRepository extends JpaRepository<CustomerEntity, Long>{

}
