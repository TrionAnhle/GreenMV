package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.TicketEntity;
import com.example.entity.TicketId;

@Repository
public interface ITicketRepository extends JpaRepository<TicketEntity, TicketId>{

}
