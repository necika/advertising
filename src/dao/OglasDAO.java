package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.introspect.VisibilityChecker;
import com.fasterxml.jackson.databind.type.MapType;
import com.fasterxml.jackson.databind.type.TypeFactory;

import beans.Korisnik;
import beans.Oglas;

public class OglasDAO {

	private Map<String, Oglas> oglasi = new HashMap<>();

	public OglasDAO(String path) {
		ucitajOglase(path);
	}

	@SuppressWarnings("unchecked")
	public void ucitajOglase(String path) {
		String putanja = path + "dummyData\\oglasi.json";
		FileWriter fileWriter = null;
		BufferedReader in = null;
		File file = null;
		try {
			file = new File(putanja);
			in = new BufferedReader(new FileReader(file));

			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.setVisibilityChecker(
					VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));
			TypeFactory factory = TypeFactory.defaultInstance();
			MapType type = factory.constructMapType(HashMap.class, String.class, Oglas.class);
			objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			oglasi = (HashMap<String, Oglas>) objectMapper.readValue(file, type);
		} catch (FileNotFoundException fnfe) {
			try {
				file.createNewFile();
				fileWriter = new FileWriter(file);
				ObjectMapper objectMapper = new ObjectMapper();
				objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
				objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
				String string = objectMapper.writeValueAsString(oglasi);
				fileWriter.write(string);

			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				if (fileWriter != null) {
					try {
						fileWriter.close();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}

		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date date = new Date();
		String datumIVreme = dateFormat.format(date);
		String[] pom = datumIVreme.split(" ");
		String datum = pom[0].replace('/', '-');
		for(Map.Entry<String, Oglas> par : oglasi.entrySet()) {
			if(!porediDatume(datum, par.getValue().getDatumIsticanja())) {
				oglasi.get(par.getKey()).setAktivan(3);
			}
		}
	}

	public void sacuvajOglase(String path) {
		String putanja = path + "dummyData\\oglasi.json";
		File f = new File(putanja);
		FileWriter fw = null;

		try {
			fw = new FileWriter(f);
			ObjectMapper om = new ObjectMapper();
			om.configure(SerializationFeature.INDENT_OUTPUT, true);
			om.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			String oglas = om.writeValueAsString(oglasi);
			fw.write(oglas);
			fw.flush();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fw != null) {
				try {
					fw.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

	public Oglas dodajOglas(Oglas o) {
		if (oglasi.containsKey(o.getNaziv())) {
			Oglas oglas = getOglas(o.getNaziv());
			if (oglas.isObrisan()) {
				oglasi.put(o.getNaziv(), o);
				return null;
			}
			return oglasi.get(o.getNaziv());
		}
		return oglasi.put(o.getNaziv(), o);
	}

	public void ukloniOglas(String naziv) {
		Oglas o = oglasi.get(naziv);
		if (o != null) {
			oglasi.get(o.getNaziv()).setObrisan(true);
		}
	}

	public void izmeniOglas(String naziv, Oglas o) {
		Oglas oglas = oglasi.get(naziv);
		o.setKorisnickoIme(oglas.getKorisnickoIme());
		o.setPorucilac(oglas.getPorucilac());
		o.setKorisnici(oglas.getKorisnici());
		o.setBrojOmiljenih(oglas.getBrojOmiljenih());
		o.setBrojLajkova(oglas.getBrojLajkova());
		o.setBrojDislajkova(oglas.getBrojDislajkova());
		o.setDatumPostavljanja(oglas.getDatumPostavljanja());
		o.setDatumIsticanja(oglas.getDatumIsticanja());
		o.setAktivan(oglas.getAktivan());
		o.setObrisan(oglas.isObrisan());
		o.setRecenzije(oglas.getRecenzije());
		oglasi.remove(naziv);
		oglasi.put(o.getNaziv(), o);
	}

	public Oglas putOglas(String naziv, Oglas oglas) {
		if (!oglasi.containsKey(naziv)) {
			return null;
		}

		return oglasi.put(naziv, oglas);
	}

	public Collection<Oglas> pretrazi(String naziv, String minCena, String maxCena, String minOcena, String maxOcena,
			String minDatum, String maxDatum, String grad, String status, Korisnik korisnik) {
		Collection<Oglas> pronadjeno = new ArrayList<Oglas>();

		for (Map.Entry<String, Oglas> entry : oglasi.entrySet()) {
			if (validan(entry.getValue(), naziv, minCena, maxCena, minOcena, maxOcena, minDatum, maxDatum, grad, status,
					korisnik)) {
				pronadjeno.add(entry.getValue());
			}
		}

		return pronadjeno;
	}

	public boolean validan(Oglas o, String naziv, String minCena, String maxCena, String minOcena, String maxOcena,
			String minDatum, String maxDatum, String grad, String status, Korisnik korisnik) {
		naziv.trim();
		grad.trim();
		if (!naziv.equals("") && !o.getNaziv().toLowerCase().contains(naziv.toLowerCase())) {
			return false;
		}
		if (!minCena.equals("")) {
			double cena = Double.parseDouble(minCena);
			double oCena = Double.parseDouble(o.getCena());
			if (cena > oCena) {
				return false;
			}
		}
		if (!maxCena.equals("")) {
			double cena = Double.parseDouble(maxCena);
			double oCena = Double.parseDouble(o.getCena());
			if (cena < oCena) {
				return false;
			}
		}
		if (!minOcena.equals("")) {
			int ocena = Integer.parseInt(minOcena);
			if (ocena > o.getBrojLajkova()) {
				return false;
			}
		}
		if (!maxOcena.equals("")) {
			int ocena = Integer.parseInt(maxOcena);
			if (ocena < o.getBrojLajkova()) {
				return false;
			}
		}
		if (!grad.equals("") && !o.getGrad().toLowerCase().contains(grad.toLowerCase())) {
			return false;
		}
		if (!minDatum.equals("")) {
			if (porediDatume(minDatum, o.getDatumIsticanja())) {
				return false;
			}
		}
		if (!maxDatum.equals("")) {
			if (porediDatume(o.getDatumIsticanja(), maxDatum)) {
				return false;
			}
		}
		if (!status.equals("")) {
			int s = 0;

			if (status.equals("Aktivan")) {
				s = 0;
			} else if (status.equals("Realizacija")) {
				s = 1;
			} else {
				s = 2;
			}

			if (s == 0 && o.getAktivan() == 0) {
				return true;
			}
			
			if(korisnik == null) {
				return false;
			} if (korisnik.getUloga().equals("Kupac")) {
				if (o.getAktivan() != s || !o.getPorucilac().equals(korisnik.getKorisnickoIme())) {
					return false;
				}
			} else {
				if (o.getAktivan() != s || !o.getKorisnickoIme().equals(korisnik.getKorisnickoIme())) {
					return false;
				}
			}
			return true;
		}

		return true;
	}

	public boolean porediDatume(String datum1, String datum2) {
		String[] d1 = datum1.split("-");
		String[] d2 = datum2.split("-");
		int god1 = Integer.parseInt(d1[0]);
		int mes1 = Integer.parseInt(d1[1]);
		int dan1 = Integer.parseInt(d1[2]);
		int god2 = Integer.parseInt(d2[0]);
		int mes2 = Integer.parseInt(d2[1]);
		int dan2 = Integer.parseInt(d2[2]);
		if (god2 > god1) {
			return true;
		}
		if (mes2 > mes1) {
			return true;
		}
		if (dan2 > dan1) {
			return true;
		}
		return false;
	}

	public Collection<Oglas> getNajpopularnijeOglase() {
		ArrayList<Oglas> najpopularniji = new ArrayList<Oglas>(oglasi.values());
		for(int i = 0; i < najpopularniji.size() - 1; i++) {
			for(int j = i + 1; j < najpopularniji.size(); j++) {
				if(najpopularniji.get(i).getBrojOmiljenih() < najpopularniji.get(j).getBrojOmiljenih()) {
					Oglas temp = najpopularniji.get(i);
					najpopularniji.set(i, najpopularniji.get(j));
					najpopularniji.set(j, temp);
				}
			}
		}
		
		if(najpopularniji.size() > 10) {
			ArrayList<Oglas> ret = new ArrayList<Oglas>();
			for(int i = 0; i < 10; i++) {
				if(najpopularniji.get(i).getAktivan() == 0 && !najpopularniji.get(i).isObrisan()) {
					ret.add(najpopularniji.get(i));
				}
			}
			
			return ret;
		}
		else {
			return najpopularniji;
		}
	}

	public boolean poruci(String korisnik, String oglas) {
		if (oglasi.get(oglas).getAktivan() == 0 && !oglasi.get(oglas).isObrisan()) {
			oglasi.get(oglas).setPorucilac(korisnik);
			oglasi.get(oglas).setAktivan(1);

			return true;
		}

		return false;
	}

	public boolean dostavi(String korisnik, String oglas) {
		if (oglasi.get(oglas).getAktivan() == 1 && oglasi.get(oglas).getPorucilac().equals(korisnik)) {
			oglasi.get(oglas).setAktivan(2);

			return true;
		}

		return false;
	}

	public Collection<String> getGradovi() {
		ArrayList<String> gradovi = new ArrayList<String>();
		for (Oglas o : oglasi.values()) {
			if (!gradovi.contains(o.getGrad())) {
				gradovi.add(o.getGrad());
			}
		}

		return gradovi;
	}

	public Oglas getOglas(String naziv) {
		return oglasi.get(naziv);
	}

	public Collection<Oglas> getOglasi() {
		return oglasi.values();
	}

	public void setOglasi(HashMap<String, Oglas> oglasi) {
		this.oglasi = oglasi;
	}
}
