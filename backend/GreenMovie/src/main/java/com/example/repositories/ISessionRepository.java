package com.example.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.entity.SessionEntity;

@Repository
public interface ISessionRepository extends JpaRepository<SessionEntity, Long>{
	
	@Query("from SessionEntity s where s.cinema.id = :id and s.finishTime >= :time")
	SessionEntity findSessionIsShowing(@Param("id")Long id, @Param("time") Date time);

	
	@Query("from SessionEntity s where s.showTime >= :time order by s.showTime")
	List<SessionEntity> findAllSessionByAtTime(@Param("time") Date time);
	
	
}
