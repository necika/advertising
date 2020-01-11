package beans;

import java.util.ArrayList;
import java.util.List;

public class Prodavac extends Korisnik {
	private List<String> objavljeniOglasi = new ArrayList<String>();
	private List<String> isporuceniProizvodi = new ArrayList<String>();
	private List<Recenzija> recenzije = new ArrayList<Recenzija>();
	private int brojLajkova;
	private int brojDislajkova;
	private int prijave;

	public Prodavac() {

	}

	public Prodavac(String korisnickoIme, String lozinka, String ime, String prezime, String uloga, Integer telefon,
			String grad, String email, String datum) {
		super(korisnickoIme, lozinka, ime, prezime, uloga, telefon, grad, email, datum);
		this.brojLajkova = 0;
		this.brojDislajkova = 0;
	}

	public int getBrojLajkova() {
		return brojLajkova;
	}

	public void setBrojLajkova(int brojLajkova) {
		this.brojLajkova = brojLajkova;
	}

	public int getBrojDislajkova() {
		return brojDislajkova;
	}

	public void setBrojDislajkova(int brojDislajkova) {
		this.brojDislajkova = brojDislajkova;
	}

	public int getPrijave() {
		return prijave;
	}

	public void setPrijave(int prijave) {
		this.prijave = prijave;
	}

	public List<String> getObjavljeniOglasi() {
		return objavljeniOglasi;
	}

	public void setObjavljeniOglasi(List<String> objavljeniOglasi) {
		this.objavljeniOglasi = objavljeniOglasi;
	}

	public List<Recenzija> getRecenzije() {
		return recenzije;
	}

	public void setRecenzije(List<Recenzija> recenzije) {
		this.recenzije = recenzije;
	}

	public List<String> getIsporuceniProizvodi() {
		return isporuceniProizvodi;
	}

	public void setIsporuceniProizvodi(List<String> isporuceniProizvodi) {
		this.isporuceniProizvodi = isporuceniProizvodi;
	}

}
