package beans;

public class Recenzija {
	private String oglas;
	private String recenzent;
	private String naslov;
	private String sadrzaj;
	private String slika;
	private boolean oglasTacan;
	private boolean ispostovanDogovor;
	private boolean obrisana;
	private String na;
	private int id;

	public Recenzija() {

	}

	public Recenzija(String oglas, String recenzent, String naslov, String sadrzaj, String slika, boolean oglasTacan,
			boolean ispostovanDogovor, String na) {
		super();
		this.oglas = oglas;
		this.recenzent = recenzent;
		this.naslov = naslov;
		this.sadrzaj = sadrzaj;
		this.slika = slika;
		this.oglasTacan = oglasTacan;
		this.ispostovanDogovor = ispostovanDogovor;
		this.obrisana = false;
		this.na = na;
		this.id = 0;
	}

	public String getOglas() {
		return oglas;
	}

	public void setOglas(String oglas) {
		this.oglas = oglas;
	}

	public String getRecenzent() {
		return recenzent;
	}

	public void setRecenzent(String recenzent) {
		this.recenzent = recenzent;
	}

	public String getNaslov() {
		return naslov;
	}

	public void setNaslov(String naslov) {
		this.naslov = naslov;
	}

	public String getSadrzaj() {
		return sadrzaj;
	}

	public void setSadrzaj(String sadrzaj) {
		this.sadrzaj = sadrzaj;
	}

	public String getSlika() {
		return slika;
	}

	public void setSlika(String slika) {
		this.slika = slika;
	}

	public boolean isOglasTacan() {
		return oglasTacan;
	}

	public void setOglasTacan(boolean oglasTacan) {
		this.oglasTacan = oglasTacan;
	}

	public boolean isIspostovanDogovor() {
		return ispostovanDogovor;
	}

	public void setIspostovanDogovor(boolean ispostovanDogovor) {
		this.ispostovanDogovor = ispostovanDogovor;
	}

	public boolean isObrisana() {
		return obrisana;
	}

	public void setObrisana(boolean obrisana) {
		this.obrisana = obrisana;
	}

	public String getNa() {
		return na;
	}

	public void setNa(String na) {
		this.na = na;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

}
