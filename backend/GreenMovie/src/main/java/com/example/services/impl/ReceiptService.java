package com.example.services.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.api.response.admin.ReceiptResponse;
import com.example.constants.AppConstants;
import com.example.dtos.TicketDTO;
import com.example.dtos.admin.ReceiptDTO;
import com.example.entity.ReceiptEntity;
import com.example.entity.TicketEntity;
import com.example.repositories.IReceiptRepository;
import com.example.services.IReceiptService;

@Service
public class ReceiptService implements IReceiptService{
	
	@Autowired
	private IReceiptRepository receiptRepository;
	
	@Autowired
	private ModelMapper modelMapper;

	@Override
	public ReceiptResponse findAll() {
		List<ReceiptEntity> entities = receiptRepository.findAll();
		List<ReceiptDTO> dtos = new ArrayList<>();
		for (ReceiptEntity e : entities) {
			ReceiptDTO dto = modelMapper.map(e, ReceiptDTO.class);
			dto.setCustomerName(e.getCustomer().getFullName());
			dto.setCustomerPhone(e.getCustomer().getPhone());
			dtos.add(dto);
		}
		return new ReceiptResponse(true, "", dtos);
	}

	@Override
	public ReceiptResponse findOne(Long id) {
		ReceiptEntity entity = receiptRepository.findById(id).orElse(null);
		if (entity == null)
			return new ReceiptResponse(false, AppConstants.NOT_FOUND_DATA);
		ReceiptDTO dto = toDTO(entity);
		return new ReceiptResponse(true, "", Arrays.asList(dto));
	}

	@Override
	public ReceiptResponse updateStatusReceipt(ReceiptDTO dto) {
		// TODO Auto-generated method stub
		return null;
	}
	
	public ReceiptDTO toDTO(ReceiptEntity entity) {
		ReceiptDTO dto = new ReceiptDTO();
		
		dto = modelMapper.map(entity, ReceiptDTO.class);
		dto.setCustomerName(entity.getCustomer().getFullName());
		dto.setCustomerPhone(entity.getCustomer().getPhone());
		List<TicketDTO> listTicket = new ArrayList<>();
		for(TicketEntity i : entity.getTickets()) {
			TicketDTO ticket = new TicketDTO();
			
			ticket.setSeatId(i.getId().getSeatId());
			ticket.setMovie(i.getSession().getMovie().getName());
			ticket.setCinema(i.getSession().getCinema().getName());
			ticket.setShowTime(i.getSession().getShowTime());
			
			listTicket.add(ticket);
		}
		dto.setTickets(listTicket);
		return dto;
	}

}
