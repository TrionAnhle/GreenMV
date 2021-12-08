package com.example.constants;

public enum ETypeCinema {
	RAP_2D,	RAP_3D, RAP_IMAX;
	
	public static ETypeCinema getTypeOfCinema(int i) {
		switch(i) {
		case 0 : return ETypeCinema.RAP_2D;
		case 1 : return ETypeCinema.RAP_3D;
		case 2 : return ETypeCinema.RAP_IMAX;
		default: return ETypeCinema.RAP_2D;
		}
	}
	public static Long getPriceByCinema(ETypeCinema type) {
		switch(type) {
		case RAP_2D: return 60000L;
		case RAP_3D : return 70000L;
		case RAP_IMAX: return 100000L;
		default: return 60000L;
		}
	}
}
