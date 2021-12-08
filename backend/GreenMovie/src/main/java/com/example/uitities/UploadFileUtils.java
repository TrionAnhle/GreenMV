package com.example.uitities;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Base64;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UploadFileUtils {

	private static final Logger logger = LoggerFactory.getLogger(UploadFileUtils.class);


	public String  saveImage(String base64, String imageName) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		
		byte[] bytes = Base64.getDecoder().decode(base64.split(",")[1].getBytes());
		String newPathImage = (authentication.getName()
				+ String.valueOf(System.currentTimeMillis() + imageName));

		try {
			String fileLocation = new File("src\\main\\resources\\static\\images").getAbsolutePath() + "\\"
					+ newPathImage;

			FileOutputStream output = new FileOutputStream(fileLocation);
			output.write(bytes);
			output.close();
			logger.error("Save images success");
		} catch (Exception e) {
			logger.error("Save images fail e" +e.getMessage());
		}

		return newPathImage;
	}

	public void deleteImage(String imageName) {
		String fileLocation = new File("src\\main\\resources\\static\\images").getAbsolutePath() + "\\"
				+ imageName;
		File serverFile = new File(fileLocation);
		if(serverFile.delete()) {
			logger.error("Delete image success");
		}else logger.error("Delete image fail");
	}

}
