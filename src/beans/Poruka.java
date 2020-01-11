package beans;

public class Poruka {
	private String nazivOglasa;
	private String posiljalac;
	private String naslovPoruke;
	private String sadrzajPoruke;
	private String datumIVreme;
	private boolean obrisana;
	private int id;
	private int par;
	private boolean odgovor;

	public Poruka() {

	}

	public Poruka(String nazivOglasa, String posiljalac, String naslovPoruke, String sadrzajPoruke,
			String datumIVreme) {
		super();
		this.nazivOglasa = nazivOglasa;
		this.posiljalac = posiljalac;
		this.naslovPoruke = naslovPoruke;
		this.sadrzajPoruke = sadrzajPoruke;
		this.datumIVreme = datumIVreme;
		this.obrisana = false;
		this.odgovor = false;
		this.par = -1;
	}

	public String getNazivOglasa() {
		return nazivOglasa;
	}

	public void setNazivOglasa(String nazivOglasa) {
		this.nazivOglasa = nazivOglasa;
	}

	public String getPosiljalac() {
		return posiljalac;
	}

	public void setPosiljalac(String posiljalac) {
		this.posiljalac = posiljalac;
	}
	
	public String getNaslovPoruke() {
		return naslovPoruke;
	}

	public void setNaslovPoruke(String naslovPoruke) {
		this.naslovPoruke = naslovPoruke;
	}

	public String getSadrzajPoruke() {
		return sadrzajPoruke;
	}

	public void setSadrzajPoruke(String sadrzajPoruke) {
		this.sadrzajPoruke = sadrzajPoruke;
	}

	public String getDatumIVreme() {
		return datumIVreme;
	}

	public void setDatumIVreme(String datumIVreme) {
		this.datumIVreme = datumIVreme;
	}

	public boolean isObrisana() {
		return obrisana;
	}

	public void setObrisana(boolean obrisana) {
		this.obrisana = obrisana;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getPar() {
		return par;
	}

	public void setPar(int par) {
		this.par = par;
	}

	public boolean isOdgovor() {
		return odgovor;
	}

	public void setOdgovor(boolean odgovor) {
		this.odgovor = odgovor;
	}

}
