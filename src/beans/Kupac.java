package beans;

import java.util.ArrayList;
import java.util.List;

public class Kupac extends Korisnik {
	private List<String> poruceniProizvodi = new ArrayList<String>();
	private List<Oglas> dostavljeniProizvodi = new ArrayList<Oglas>();
	private List<String> omiljeniOglasi = new ArrayList<String>();
	private List<String> ocene = new ArrayList<String>();
	private List<String> prijave = new ArrayList<String>();

	public Kupac() {

	}

	public Kupac(String korisnickoIme, String lozinka, String ime, String prezime, String uloga, Integer telefon,
			String grad, String email, String datum) {
		super(korisnickoIme, lozinka, ime, prezime, uloga, telefon, grad, email, datum);
	}

	public List<String> getPoruceniProizvodi() {
		return poruceniProizvodi;
	}

	public void setPoruceniProizvodi(List<String> poruceniProizvodi) {
		this.poruceniProizvodi = poruceniProizvodi;
	}

	public List<Oglas> getDostavljeniProizvodi() {
		return dostavljeniProizvodi;
	}

	public void setDostavljeniProizvodi(List<Oglas> dostavljeniProizvodi) {
		this.dostavljeniProizvodi = dostavljeniProizvodi;
	}
	
	public List<String> getOmiljeniOglasi() {
		return omiljeniOglasi;
	}

	public void setOmiljeniOglasi(List<String> omiljeniOglasi) {
		this.omiljeniOglasi = omiljeniOglasi;
	}

	public boolean addOmiljeni(String oglas) {
		if(!omiljeniOglasi.contains(oglas)) {
			return omiljeniOglasi.add(oglas);
		}
		return false;
	}
	
	public List<String> getOcene() {
		return ocene;
	}

	public void setOcene(List<String> ocene) {
		this.ocene = ocene;
	}

	public List<String> getPrijave() {
		return prijave;
	}

	public void setPrijave(List<String> prijave) {
		this.prijave = prijave;
	}
}
