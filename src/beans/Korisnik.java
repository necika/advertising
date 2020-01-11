package beans;

import java.util.ArrayList;
import java.util.List;

public class Korisnik {
	private List<Poruka> poruke = new ArrayList<Poruka>();
	private String korisnickoIme;
	private String lozinka;
	private String ime;
	private String prezime;
	private String uloga;
	private Integer telefon;
	private String grad;
	private String email;
	private String datum;

	public Korisnik() {

	}

	public Korisnik(String korisnickoIme, String lozinka, String ime, String prezime, String uloga,
			Integer telefon, String grad, String email, String datum) {
		
		this.poruke = new ArrayList<Poruka>();
		this.korisnickoIme = korisnickoIme;
		this.lozinka = lozinka;
		this.ime = ime;
		this.prezime = prezime;
		this.uloga = uloga;
		this.telefon = telefon;
		this.grad = grad;
		this.email = email;
		this.datum = datum;
	}

	public String getKorisnickoIme() {
		return korisnickoIme;
	}

	public void setKorisnickoIme(String korisnickoIme) {
		this.korisnickoIme = korisnickoIme;
	}

	public String getLozinka() {
		return lozinka;
	}

	public void setLozinka(String lozinka) {
		this.lozinka = lozinka;
	}

	public String getIme() {
		return ime;
	}

	public void setIme(String ime) {
		this.ime = ime;
	}

	public String getPrezime() {
		return prezime;
	}

	public void setPrezime(String prezime) {
		this.prezime = prezime;
	}

	public String getUloga() {
		return uloga;
	}

	public void setUloga(String uloga) {
		this.uloga = uloga;
	}

	public Integer getTelefon() {
		return telefon;
	}

	public void setTelefon(Integer telefon) {
		this.telefon = telefon;
	}

	public String getGrad() {
		return grad;
	}

	public void setGrad(String grad) {
		this.grad = grad;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDatum() {
		return datum;
	}

	public void setDatum(String datum) {
		this.datum = datum;
	}

	public List<Poruka> getPoruke() {
		return poruke;
	}

	public void setPoruke(List<Poruka> poruke) {
		this.poruke = poruke;
	}
}
