package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
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
import beans.Kupac;
import beans.Oglas;
import beans.Prodavac;

public class KorisnikDAO {

	private Map<String, Korisnik> korisnici = new HashMap<>();

	public KorisnikDAO() {

	}

	public KorisnikDAO(String path) {
		ucitajKorisnike(path);
	}

	public void ucitajKorisnike(String path) {
		String putanja = path + "dummyData\\korisnici.json";
		FileWriter fw = null;
		BufferedReader in = null;
		File file = null;
		try {
			file = new File(putanja);
			in = new BufferedReader(new FileReader(file));
			ObjectMapper om = new ObjectMapper();
			om.setVisibilityChecker(
					VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));
			TypeFactory tf = TypeFactory.defaultInstance();
			MapType mt = tf.constructMapType(HashMap.class, String.class, Object.class);
			om.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			@SuppressWarnings("unchecked")
			HashMap<String, Object> podaci = (HashMap<String, Object>) om.readValue(file, mt);
			for (Map.Entry<String, Object> par : podaci.entrySet()) {
				ObjectMapper mapper = new ObjectMapper();
				String jsonInString = (String) par.toString();
				Korisnik k;
				if (jsonInString.contains("uloga=Kupac,")) {
					k = mapper.convertValue(par.getValue(), Kupac.class);
				} else if (jsonInString.contains("uloga=Prodavac")) {
					k = mapper.convertValue(par.getValue(), Prodavac.class);
				} else {
					k = mapper.convertValue(par.getValue(), Korisnik.class);
				}
				korisnici.put(k.getKorisnickoIme(), k);
			}
		} catch (FileNotFoundException e1) {
			try {
				file.createNewFile();
				fw = new FileWriter(file);
				ObjectMapper objectMapper = new ObjectMapper();
				objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
				objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
				String users = objectMapper.writeValueAsString(korisnici);
				fw.write(users);
			} catch (IOException e3) {
				e3.printStackTrace();
			} finally {
				if (fw != null) {
					try {
						fw.close();
					} catch (Exception e4) {
						e4.printStackTrace();
					}
				}
			}
		} catch (Exception e2) {

		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

	public void sacuvajKorisnike(String path) {
		String putanja = path + "dummyData\\korisnici.json";
		File f = new File(putanja);
		FileWriter fw = null;
		try {
			fw = new FileWriter(f);
			ObjectMapper om = new ObjectMapper();
			om.configure(SerializationFeature.INDENT_OUTPUT, true);
			om.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			String users = om.writeValueAsString(korisnici);
			fw.write(users);
			fw.flush();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fw != null) {
				try {
					fw.close();
				} catch (Exception e1) {
					e1.printStackTrace();
				}
			}
		}
	}

	public void dodajKorisnika(Korisnik k) {
		if (!korisnici.containsKey(k.getKorisnickoIme())) {
			korisnici.put(k.getKorisnickoIme(), k);
		}
	}

	public void ukloniKorisnika(Korisnik k) {
		if (korisnici.containsKey(k.getKorisnickoIme())) {
			korisnici.remove(k.getKorisnickoIme());
		}
	}

	public Korisnik getKorisnik(String ime) {
		return korisnici.get(ime);
	}

	public Collection<Korisnik> getAdmin() {
		Collection<Korisnik> admini = new ArrayList<Korisnik>();

		for (Korisnik korisnik : korisnici.values()) {
			if (korisnik.getUloga().equals("Administrator")) {
				admini.add(korisnik);
			}
		}

		return admini;
	}

	public boolean setProdavac(Korisnik korisnik) {
		if (!korisnici.containsKey(korisnik.getKorisnickoIme())) {
			return false;
		}

		Prodavac prodavac = new Prodavac(korisnik.getKorisnickoIme(), korisnik.getLozinka(), korisnik.getIme(),
				korisnik.getPrezime(), korisnik.getUloga(), korisnik.getTelefon(), korisnik.getGrad(),
				korisnik.getEmail(), korisnik.getDatum());
		korisnici.put(prodavac.getKorisnickoIme(), prodavac);
		return true;
	}

	public boolean setKupac(Korisnik korisnik) {
		if (!korisnici.containsKey(korisnik.getKorisnickoIme())) {
			return false;
		}

		Kupac kupac = new Kupac(korisnik.getKorisnickoIme(), korisnik.getLozinka(), korisnik.getIme(),
				korisnik.getPrezime(), korisnik.getUloga(), korisnik.getTelefon(), korisnik.getGrad(),
				korisnik.getEmail(), korisnik.getDatum());
		korisnici.put(kupac.getKorisnickoIme(), kupac);
		return true;
	}

	public boolean setAdmin(Korisnik korisnik) {
		if (!korisnici.containsKey(korisnik.getKorisnickoIme())) {
			return false;
		}

		korisnici.put(korisnik.getKorisnickoIme(), korisnik);
		return true;
	}

	public void poruci(String korisnik, String oglas) {
		Kupac kupac = (Kupac) korisnici.get(korisnik);
		kupac.getPoruceniProizvodi().add(oglas);
	}

	public void dostavi(String korisnik, Oglas oglas) {
		Kupac kupac = (Kupac) korisnici.get(korisnik);
		kupac.getPoruceniProizvodi().remove(oglas.getNaziv());
		kupac.getDostavljeniProizvodi().add(oglas);
	}

	public HashMap<String, Korisnik> pretrazi(String ime, String grad) {
		HashMap<String, Korisnik> pronadjeno = new HashMap<String, Korisnik>();

		for (Map.Entry<String, Korisnik> entry : korisnici.entrySet()) {
			if (validan(entry.getValue(), ime, grad)) {
				pronadjeno.put(entry.getKey(), entry.getValue());
			}
		}

		return pronadjeno;
	}

	public boolean validan(Korisnik k, String ime, String grad) {
		ime.trim();
		grad.trim();
		if (!ime.equals("") && !k.getIme().toLowerCase().contains(ime.toLowerCase())) {
			return false;
		}
		if (!grad.equals("") && !k.getGrad().toLowerCase().contains(grad.toLowerCase())) {
			return false;
		}

		return true;
	}
	
	public Collection<Korisnik> Korisnici() {
		return korisnici.values();
	}
	
	public Map<String, Korisnik> getKorisnici() {
		return korisnici;
	}

	public void setKorisnici(Map<String, Korisnik> korisnici) {
		this.korisnici = korisnici;
	}
}
