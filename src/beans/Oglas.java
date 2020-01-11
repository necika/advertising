package beans;

import java.util.ArrayList;
import java.util.List;

public class Oglas {
	private String porucilac;
	private String korisnickoIme;
	private List<String> korisnici = new ArrayList<String>();
	private int brojOmiljenih = 0;
	private String naziv;
	private String cena;
	private String opis;
	private int brojLajkova;
	private int brojDislajkova;
	private String nazivSlike;
	private String datumPostavljanja;
	private String datumIsticanja;
	private String kategorija;
	private boolean obrisan;
	private int aktivan; 
	private List<Recenzija> recenzije = new ArrayList<Recenzija>();
	private String grad;

	public Oglas() {

	}

	public Oglas(String naziv, String cena, String opis, int brojLajkova, int brojDislajkova, String nazivSlike,
			String datumPostavljanja, String datumIsticanja,  String kategorija, String grad) {
		super();
		this.naziv = naziv;
		this.cena = cena;
		this.opis = opis;
		this.brojLajkova = brojLajkova;
		this.brojDislajkova = brojDislajkova;
		this.nazivSlike = nazivSlike;
		this.datumPostavljanja = datumPostavljanja;
		this.datumIsticanja = datumIsticanja;
		this.kategorija = kategorija;
		this.aktivan = 0;
		this.grad = grad;
		this.obrisan = false;
	}

	public String getNaziv() {
		return naziv;
	}

	public void setNaziv(String naziv) {
		this.naziv = naziv;
	}

	public String getCena() {
		return cena;
	}

	public void setCena(String cena) {
		this.cena = cena;
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

	public String getDatumPostavljanja() {
		return datumPostavljanja;
	}

	public void setDatumPostavljanja(String datumPostavljanja) {
		this.datumPostavljanja = datumPostavljanja;
	}

	public String getDatumIsticanja() {
		return datumIsticanja;
	}

	public void setDatumIsticanja(String datumIsticanja) {
		this.datumIsticanja = datumIsticanja;
	}

	public String getGrad() {
		return grad;
	}

	public void setGrad(String grad) {
		this.grad = grad;
	}

	public List<Recenzija> getRecenzije() {
		return recenzije;
	}

	public void setRecenzije(List<Recenzija> recenzije) {
		this.recenzije = recenzije;
	}

	public String getNazivSlike() {
		return nazivSlike;
	}

	public void setNazivSlike(String nazivSlike) {
		this.nazivSlike = nazivSlike;
	}

	public String getOpis() {
		return opis;
	}

	public void setOpis(String opis) {
		this.opis = opis;
	}

	public String getKategorija() {
		return kategorija;
	}

	public void setKategorija(String kategorija) {
		this.kategorija = kategorija;
	}

	public boolean isObrisan() {
		return obrisan;
	}

	public void setObrisan(boolean obrisan) {
		this.obrisan = obrisan;
	}

	public String getKorisnickoIme() {
		return korisnickoIme;
	}

	public void setKorisnickoIme(String korisnickoIme) {
		this.korisnickoIme = korisnickoIme;
	}

	public int getAktivan() {
		return aktivan;
	}

	public void setAktivan(int aktivan) {
		this.aktivan = aktivan;
	}

	public String getPorucilac() {
		return porucilac;
	}

	public void setPorucilac(String porucilac) {
		this.porucilac = porucilac;
	}

	public List<String> getKorisnici() {
		return korisnici;
	}

	public void setKorisnici(List<String> korisnici) {
		this.korisnici = korisnici;
	}

	public int getBrojOmiljenih() {
		return brojOmiljenih;
	}

	public void setBrojOmiljenih(int brojOmiljenih) {
		this.brojOmiljenih = brojOmiljenih;
	}

}
