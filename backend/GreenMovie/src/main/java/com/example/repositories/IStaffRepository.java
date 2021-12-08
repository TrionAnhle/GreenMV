package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.StaffEntity;

@Repository
public interface IStaffRepository extends JpaRepository<StaffEntity, Long>{

}
