package beans;

import java.util.ArrayList;
import java.util.List;

public class Kategorija {
	private String naziv;
	private String opis;
	private List<String> oglasi = new ArrayList<String>();
	private boolean obrisana;

	public Kategorija() {

	}

	public Kategorija(String naziv, String opis) {
		this.naziv = naziv;
		this.opis = opis;
	}

	public String getNaziv() {
		return naziv;
	}

	public void setNaziv(String naziv) {
		this.naziv = naziv;
	}

	public String getOpis() {
		return opis;
	}

	public void setOpis(String opis) {
		this.opis = opis;
	}

	public boolean isObrisana() {
		return obrisana;
	}

	public void setObrisana(boolean obrisana) {
		this.obrisana = obrisana;
	}

	public List<String> getOglasi() {
		return oglasi;
	}

	public void setOglasi(List<String> oglasi) {
		this.oglasi = oglasi;
	}

}
